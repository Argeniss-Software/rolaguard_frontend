import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Accordion , Modal, Icon, Button, Label, Popup, Grid, Table } from "semantic-ui-react";
import { Markup } from 'interweave';

import "./inventory.modal.component.css";
import Tag from "../utils/tags/tag.component";
import TagSelector from "../utils/tags/tag.selector.component";
import AlertUtil from "../../util/alert-util";
import moment from "moment";
import { withRouter } from 'react-router-dom';
import ItemDetailsIcon from "./inventory.modal.icon.component";

class InventoryDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [
        {name: "tag1", color: "#5d9cec", id: "idtag1"},
        {name: "tag2", color: "#fad732", id: "idtag2"},
        {name: "tag3", color: "#ff902b", id: "idtag3"},
        {name: "tag4", color: "#f05050", id: "idtag4"},
        {name: "tag5", color: "#1f77b4", id: "idtag5"},
        {name: "tag11", color: "#5d9cec", id: "idtag11"},
        {name: "tag21", color: "#fad732", id: "idtag21"},
        {name: "tag31", color: "#ff902b", id: "idtag31"},
        {name: "tag41", color: "#f05050", id: "idtag41"},
        {name: "tag51", color: "#1f77b4", id: "idtag51"},
        {name: "tag12", color: "#5d9cec", id: "idtag12"},
        {name: "tag22", color: "#fad732", id: "idtag22"},
        {name: "tag32", color: "#ff902b", id: "idtag32"},
        {name: "tag42", color: "#f05050", id: "idtag42"},
        {name: "tag52", color: "#1f77b4", id: "idtag52"},
        {name: "tag13", color: "#5d9cec", id: "idtag13"},
        {name: "tag23", color: "#fad732", id: "idtag23"},
        {name: "tag33", color: "#ff902b", id: "idtag33"},
        {name: "tag43", color: "#f05050", id: "idtag43"},
        {name: "tag53", color: "#1f77b4", id: "idtag53"},
        {name: "tag1", color: "#5d9cec", id: "idtag1"},
        {name: "tag2", color: "#fad732", id: "idtag2"},
        {name: "tag3", color: "#ff902b", id: "idtag3"},
        {name: "tag4", color: "#f05050", id: "idtag4"},
        {name: "tag5", color: "#1f77b4", id: "idtag5"},
        {name: "tag11", color: "#5d9cec", id: "idtag11"},
        {name: "tag21", color: "#fad732", id: "idtag21"},
        {name: "tag31", color: "#ff902b", id: "idtag31"},
        {name: "tag41", color: "#f05050", id: "idtag41"},
        {name: "tag51", color: "#1f77b4", id: "idtag51"},
        {name: "tag12", color: "#5d9cec", id: "idtag12"},
        {name: "tag22", color: "#fad732", id: "idtag22"},
        {name: "tag32", color: "#ff902b", id: "idtag32"},
        {name: "tag42", color: "#f05050", id: "idtag42"},
        {name: "tag52", color: "#1f77b4", id: "idtag52"},
        {name: "tag13", color: "#5d9cec", id: "idtag13"},
        {name: "tag23", color: "#fad732", id: "idtag23"},
        {name: "tag33", color: "#ff902b", id: "idtag33"},
        {name: "tag43", color: "#f05050", id: "idtag43"},
        {name: "tag53", color: "#1f77b4", id: "idtag53"},
        {name: "tag1", color: "#5d9cec", id: "idtag1"},
        {name: "tag2", color: "#fad732", id: "idtag2"},
        {name: "tag3", color: "#ff902b", id: "idtag3"},
        {name: "tag4", color: "#f05050", id: "idtag4"},
        {name: "tag5", color: "#1f77b4", id: "idtag5"},
        {name: "tag11", color: "#5d9cec", id: "idtag11"},
        {name: "tag21", color: "#fad732", id: "idtag21"},
        {name: "tag31", color: "#ff902b", id: "idtag31"},
        {name: "tag41", color: "#f05050", id: "idtag41"},
        {name: "tag51", color: "#1f77b4", id: "idtag51"},
        {name: "tag12", color: "#5d9cec", id: "idtag12"},
        {name: "tag22", color: "#fad732", id: "idtag22"},
        {name: "tag32", color: "#ff902b", id: "idtag32"},
        {name: "tag42", color: "#f05050", id: "idtag42"},
        {name: "tag52", color: "#1f77b4", id: "idtag52"},
        {name: "tag13", color: "#5d9cec", id: "idtag13"},
        {name: "tag23", color: "#fad732", id: "idtag23"},
        {name: "tag33", color: "#ff902b", id: "idtag33"},
        {name: "tag43", color: "#f05050", id: "idtag43"},
        {name: "tag53", color: "#1f77b4", id: "idtag53"},
        {name: "tag1", color: "#5d9cec", id: "idtag1"},
        {name: "tag2", color: "#fad732", id: "idtag2"},
        {name: "tag3", color: "#ff902b", id: "idtag3"},
        {name: "tag4", color: "#f05050", id: "idtag4"},
        {name: "tag5", color: "#1f77b4", id: "idtag5"},
        {name: "tag11", color: "#5d9cec", id: "idtag11"},
        {name: "tag21", color: "#fad732", id: "idtag21"},
        {name: "tag31", color: "#ff902b", id: "idtag31"},
        {name: "tag41", color: "#f05050", id: "idtag41"},
        {name: "tag51", color: "#1f77b4", id: "idtag51"},
        {name: "tag12", color: "#5d9cec", id: "idtag12"},
        {name: "tag22", color: "#fad732", id: "idtag22"},
        {name: "tag32", color: "#ff902b", id: "idtag32"},
        {name: "tag42", color: "#f05050", id: "idtag42"},
        {name: "tag52", color: "#1f77b4", id: "idtag52"},
        {name: "tag13", color: "#5d9cec", id: "idtag13"},
        {name: "tag23", color: "#fad732", id: "idtag23"},
        {name: "tag33", color: "#ff902b", id: "idtag33"},
        {name: "tag43", color: "#f05050", id: "idtag43"},
        {name: "tag53", color: "#1f77b4", id: "idtag53"},
      ],
      isLoading: true,
      modalOpen: true,
      item: this.props.item.item,
      activeIndex: 1
    };

    this.hanldleTagSelected = this.hanldleTagSelected.bind(this)
  }

  componentWillMount(){
    this.setState({
      item: this.props.item.item
    });
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
        { title: "Data Source", value: item.data_collector }
      ]
    }
    if(item.type.trim().toLowerCase() === 'gateway'){
      table = [
        { title: "Item type",  value: item.type },
        { title: "Gateway ID",value: item.id },
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.application },
        { title: "Data Source", value: item.data_collector }
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

  hanldleTagSelected(tag){
    let { item } = this.state;
    item.tags.push(tag)
    this.setState({
      item,
    });
    // Call API to apply tag to selected element
  }

  render() {
    const { modalOpen, activeIndex, item } = this.state;
    const { itemType, isFirst, isLast } = this.props.item;

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
              Tags: {this.showTags(item.tags)}
              <TagSelector
                tags={this.state.tags.filter((tag) => !item.tags.map((tag) => tag.id).includes(tag.id))}
                onSelection={this.hanldleTagSelected}
              />
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
