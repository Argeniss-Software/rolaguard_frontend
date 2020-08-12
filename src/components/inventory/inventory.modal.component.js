import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Accordion , Modal, Icon, Button, Segment, Grid, Table, Divider} from "semantic-ui-react";
import { withRouter } from 'react-router-dom';

import "./inventory.modal.component.css";
import Tag from "../utils/tags/tag.component";
import TagSelector from "../utils/tags/tag.selector.component";
import LoaderComponent from "../utils/loader.component";
import ItemDetailsIcon from "./inventory.modal.icon.component";

@inject("tagsStore")
@observer
class InventoryDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      modalOpen: true,
      item: this.props.selectedItem.item,
      activeIndex: this.props.selectedItem.index 
    };

    this.hanldleTagSelected = this.hanldleTagSelected.bind(this)
  }

  handleClose = e => {
    this.setState({ modalOpen: false });
    this.props.onClose();
  };

  handleNext = e => {
    this.setState({
      item: this.props.onNavigate(+1).item
    });
  };

  handlePrev = e => {
    this.setState({
      item: this.props.onNavigate(-1).item
    });
  };
  
  getPArameterValue(parameters, parameterName) {
    return parameters[parameterName];
  }

  showTags(tags){
      return tags.map((tag)=>{return <Tag key={tag.id} name={tag.name} removable={true} color={tag.color} id={tag.id} onRemoveClick={() => this.handleTagRemoval(tag)}/>})
  }

  showTechnicalDetails(item){

    let table = [];

    if(item && item.type && item.type.trim().toLowerCase() === 'device'){
      table = [
        { title: "Item type", value: item.type },
        { title: "DevEUI", value: item.hex_id? item.hex_id.toUpperCase() : null},
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.application },
        { title: "Data Collector", value: item.data_collector }
      ]
    }
    if(item && item.type && item.type.trim().toLowerCase() === 'gateway'){
      table = [
        { title: "Item type",  value: item.type },
        { title: "Gateway ID",value: item.hex_id? item.hex_id.toUpperCase() : null },
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
        <Table.Row key={row.title}>
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
    return (<div style={{backgroundColor: "#e0e1e2", textAlign:"center", width: "100%", borderRadius: "5px", marginTop:"10px"}}>
      <h5 style={{color: "gray", alignSelf:"center", paddingTop: "10px"}}>WORK IN PROGRESS</h5>
      <i className="fas fa-exclamation fa-4x" style={{color: "gray", alignContent:"center", paddingBottom: "10px"}}></i>
    </div>);
  }

  hanldleTagSelected(tag){
    let { item } = this.state;
    this.props.tagsStore.assignTag(tag, item).then(() => {
      item.tags.push(tag)
      this.setState({
        item,
      });
    });
  }


  handleTagRemoval = (tag) => {
    const { item } = this.state;
    this.props.tagsStore.removeTag(tag, item).then(() =>{
      item.tags = item.tags.filter((t) => t.id !== tag.id);
      this.setState({
        item
      });
    });
  }

  render() {
    const { modalOpen, activeIndex } = this.state;
    const { index, itemType, isFirst, isLast } = this.props.selectedItem;
    const { assets } = this.props;
    const item = assets[index];

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={false}
        open={modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>
          {(item.name && item.name.toUpperCase()) || (item.hex_id && item.type && `${item.type.toUpperCase()}: ${item.hex_id}`) || (item.type && item.type.toUpperCase())}
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
        <Modal.Content id="modal-content">
          {!this.props.loading &&
            <Grid divided id="modal-content-grid">
              <Grid.Row>
                <Grid.Column width={5} className="modal-content-grid">
                    <ItemDetailsIcon item={item} />
                    <strong>Geolocation:</strong>
                    {this.showGeolocation(item.location)}
                  </Grid.Column>
                <Grid.Column width={10}>
                  <Grid.Row className="modal-content-grid">
                    <strong>Tags: </strong>
                    {this.showTags(item.tags)} <TagSelector alreadyAssignTags={item.tags} onSelection={this.hanldleTagSelected} />
                  </Grid.Row>
                  <Divider />
                  <Grid.Row className="modal-content-grid">
                    <strong>Technical details</strong>
                    <div className="asset-details-technical-table">
                      <Table compact="very" celled padded>
                        <Table.Body>
                          {this.showTechnicalDetails(item)}
                        </Table.Body>
                      </Table>
                    </div>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
          {this.props.loading &&
            <LoaderComponent loadingMessage="Loading details ..." style={{marginBottom: 20}}/>  
          }
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
