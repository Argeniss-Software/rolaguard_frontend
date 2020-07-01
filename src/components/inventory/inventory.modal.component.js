import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Accordion , Modal, Icon, Button, Label, Popup, Grid, Table } from "semantic-ui-react";
import { Markup } from 'interweave';

import "./inventory.modal.component.css";
import Tag from "../utils/tags/tag.component";
import AlertUtil from "../../util/alert-util";
import moment from "moment";
import { withRouter } from 'react-router-dom';
import ItemDetailsIcon from "./inventory.modal.icon.component";

class InventoryDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      modalOpen: true,
      itemDetails: null,
      activeIndex: 1
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

  showTags(tags){
      return tags.map((tag)=>{return <Tag name={tag.name} color={tag.color} id={tag.id}/>})
  }

  showTechnicalDetails(item){

    let table = [];

    if(item.type.trim().toLowerCase() === 'device'){
      table = [
        { title: "Item type", value: item.type },
        { title: "DevEUI", value: item.id },
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.application },
        { title: "Data Collector", value: item.data_collector }
      ]
    }
    if(item.type.trim().toLowerCase() === 'gateway'){
      table = [
        { title: "Item type",  value: item.type },
        { title: "Gateway ID",value: item.id },
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.application },
        { title: "Data Collector", value: item.data_collector }
      ]
    }

    if (table == 0){
      return (
        <Table.Row>
          <Table.Cell>
            Oops, there is no technical details to show. This must be an error, please contact support.
          </Table.Cell>
        </Table.Row>
      );
    }

    return(table.filter((row) => row.value).map((row) => {
      return (
        <Table.Row>
        <Table.Cell width="3" 
          className="technical-details-table-row-left"
          style={{"borderTop": "1px solid lightgray !important"}}>
            <i>{row.title}</i>
        </Table.Cell>
        <Table.Cell width="3" className={"technical-details-table-row-right"}><b>{row.value}</b></Table.Cell>
      </Table.Row>
      )
    }));
  }

  showGeolocation(location){
    return (<div style={{backgroundColor: "#e0e1e2", textAlign:"center", width: "100%", borderRadius: "5px"}}>
      <h5 style={{color: "gray", alignSelf:"center", paddingTop: "10px"}}>WORK IN PROGRESS</h5>
      <i class="fas fa-exclamation fa-4x" style={{color: "gray", alignContent:"center", paddingBottom: "10px"}}></i>
    </div>);
  }

  render() {
    const { modalOpen, activeIndex } = this.state;
    const { item, itemType, isFirst, isLast } = this.props.item

    const locationIndex = 2;
    const technicalDetailsIndex = 1;

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={false}
        open={modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>{(item.name && item.name.toUpperCase()) || (item.id && item.type && `${item.type.toUpperCase()}: ${item.id}`) || (item.type && item.type.toUpperCase())}
          <div style={{float:"right"}}>
            {this.props.onNavigate &&
              <Button
                loading={this.props.loading}
                floated={"left"}
                disabled={isFirst || this.props.loading}
                onClick={() => this.handlePrev()}
                content="Previous"
              />
            }

            {this.props.onNavigate &&
              <Button
                loading={this.props.loading}
                floated={"left"}
                disabled={isLast|| this.props.loading}
                onClick={() => this.handleNext()}
                content="Next"
              />
            }
          </div>
        </Modal.Header>
        <Modal.Content>
              Tags: {this.showTags(item.tags)} <Tag name="+ add tag" color="#e0e1e2" textColor="rgba(0,0,0,.6)" onSelection={() => alert("Work in progress")}/>
          <Modal.Description>
            <Accordion>
              <div>
                <Accordion.Title active={activeIndex === technicalDetailsIndex} index={technicalDetailsIndex} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  <strong>Technical details</strong>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === technicalDetailsIndex}>
                  <div className="asset-details-technical-table">
                    <Table compact="very" celled padded>
                      <Table.Body>
                        {this.showTechnicalDetails(item)}
                      </Table.Body>
                    </Table>
                  </div>
                </Accordion.Content>
              </div>
              <div>
                <Accordion.Title active={activeIndex === locationIndex} index={locationIndex} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  <strong>Geolocation</strong>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === locationIndex}>
                 {this.showGeolocation(item.location)}
                </Accordion.Content>
              </div>
            </Accordion>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => this.handleClose()}
            content="Close"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(InventoryDetailsModal);
