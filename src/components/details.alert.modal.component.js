import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Accordion , Modal, Icon, Button, Label, Popup, Grid, Table } from "semantic-ui-react";
import { Markup } from 'interweave';  

import "./details.alert.modal.component.css";
import AlertUtil from "../util/alert-util";
import moment from "moment";
import { withRouter } from 'react-router-dom';
import AlertDetailTableIcon from "./alert/alert.details.table.icons";

@inject("alarmStore", "alertStore", "authStore", "generalDataStore", "usersStore")
@observer
class DetailsAlertModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: true,
      alertDetails: null
    };
  }

  handleClose = e => {
    this.setState({ modalOpen: false });
    this.props.onClose();
  };

  handleNext = e => {
    this.props.onNavigate(+1);
  };

  handlePrev = e => {
    this.props.onNavigate(-1);
  };

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    const modalContainer = e.target.closest('.scrolling');
    //Fix modal size issue after technical details opened
    if (newIndex === -1 && modalContainer){
      modalContainer.classList.remove("scrolling");
    }
    this.setState({ activeIndex: newIndex })
  }

  
  getPArameterValue(parameters, parameterName) {
    return parameters[parameterName];
  }

  render() {
    const { modalOpen, activeIndex } = this.state;
    const { alert, alert_type, isFirst, isLast } = this.props.alert

    function isFloat(value) {
      return typeof value === 'number' && value % 1 !== 0;
    }

    let message = alert_type.message;
    let alertMessage = alert_type.message.match(/\{.+?\}/g);
    message = `${message}`; 
    message = message.replace(`{packet_id}`, `<b>${alert.packet_id}</b>`);
    message = message.replace(`{created_at}`, `<b>${moment(alert.created_at).format("YYYY-MM-DD HH:mm:ss")}</b>`);

    let messageTable = []
    for (let i = 0; i < alertMessage.length - 1; i++) { 
      let messageParameter = alertMessage[i].replace(/[{()}]/g, '');
      let value = this.getPArameterValue(alert.parameters, messageParameter);
      const parameterToUpper = AlertUtil.parameters.toUpper.includes(messageParameter);
      const header = AlertUtil.getParameterHeader(messageParameter);

      if(isFloat(value) && messageParameter.indexOf('lati') === -1 && messageParameter.indexOf('long') === -1) {
        value = value.toFixed(2);
      }
      if (value) {
        messageTable.push(
          <Table.Row key={messageParameter}>
            <Table.Cell width="3" 
              className="technical-details-table-row-left" 
              style={{"borderTop": "1px solid lightgray !important"}}><i>{header}</i></Table.Cell>
            <Table.Cell width="3" className={parameterToUpper? "technical-details-table-row-right upper": "technical-details-table-row-right"}><b>{value}</b></Table.Cell>
          </Table.Row>
          );
      }
    }

    const resolution = alert.resolved_by ? `This alert was resolved by ${alert.resolved_by.full_name}, ${moment(alert.resolved_by).calendar().toLowerCase()}.` : null

    const recommendedActionIndex = 0;
    const technicalDescriptionIndex = 1;
    const resolutionIndex = 2;

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={false}
        open={modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>{alert_type.name}
          <Label horizontal style={{float: 'left', backgroundColor: AlertUtil.getColorsMap()[alert_type.risk], color: 'white', borderWidth: 1, width: '80px'}} >
            {alert_type.risk}
          </Label>
          <div style={{float:"right"}}>
            {this.props.onNavigate &&
              <Button
                loading={this.props.loading}
                floated={"left"}
                disabled={isFirst || this.props.loading}
                onClick={() => this.handlePrev()}
                content="Next"
              />
            }

            {this.props.onNavigate &&
              <Button
                loading={this.props.loading}
                floated={"left"}
                disabled={isLast|| this.props.loading}
                onClick={() => this.handleNext()}
                content="Previous"
              />
            }
          </div>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <AlertDetailTableIcon parameters={this.props.alert.alert.parameters} />
            <p>{alert_type.description}</p>
            <div style={{marginBottom: 15 }}>
              <p style={{fontWeight: 'bolder', marginBottom: 3 }}>Source</p>
              Message collector <i>{alert.data_collector_name}</i>
            </div>

            <Accordion>
              { alert_type.recommendedAction &&
              <div>
                <Accordion.Title active={activeIndex === recommendedActionIndex} 
                index={recommendedActionIndex} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  <strong>Recommended Action</strong>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === recommendedActionIndex} >
                  <Markup content={alert_type.recommendedAction} />
                </Accordion.Content>
              </div>
              }
              <Accordion.Title active={activeIndex === technicalDescriptionIndex} 
              index={technicalDescriptionIndex} onClick={this.handleAccordionClick} ref="technical-detail">
                <Icon name='dropdown' />
                <strong>Technical details</strong>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === technicalDescriptionIndex}>
                <Markup content={alert_type.technicalDescription} />
                <br />
                {/* <Markup content={message} /> */}
                <div className="alert-details-technical-table">
                  <Table compact="very" celled padded>
                    <Table.Body>
                      {messageTable}
                    </Table.Body>
                  </Table>
                </div>
              </Accordion.Content>
              { resolution &&
              <div>
                <Accordion.Title active={activeIndex === resolutionIndex} index={resolutionIndex} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  <strong>Resolution</strong>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === resolutionIndex}>
                    <Markup content={resolution}/>
                    {alert.resolution_comment && 
                      <i>
                        <br />
                        <Markup content={alert.resolution_comment}/>
                      </i>
                    }
                </Accordion.Content>
              </div>
              }
            </Accordion>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          {this.props.showGoToAlerts && <Button
              onClick={() => this.props.history.push('/dashboard/alerts_review')}
              content="Go to Alerts"
            />}

          <Button
            onClick={() => this.handleClose()}
            content="Close"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(DetailsAlertModal);
