import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Modal, Button, Grid, Table, Divider } from "semantic-ui-react";
import Skeleton from 'react-loading-skeleton';

import "./inventory.modal.component.css";
import Tag from "../utils/tags/tag.component";
import TagSelector from "../utils/tags/tag.selector.component";
import LoaderComponent from "../utils/loader.component";
import ItemDetailsIcon from "./inventory.modal.icon.component";
import ImportanceLabel from "../utils/importance-label.component"
import Geolocation from "../utils/geolocation/geolocation.component";

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
    this.props.onNavigate(+1);
  };

  handlePrev = e => {
    this.props.onNavigate(-1);
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
        { title: "Application", value: item.app_name },
        { title: "join_eui/app_eui", value: item.join_eui? item.join_eui.toUpperCase() :null},
        { title: "Data Source", value: item.data_collector }
      ]
    }
    if(item && item.type && item.type.trim().toLowerCase() === 'gateway'){
      table = [
        { title: "Item type",  value: item.type },
        { title: "Gateway ID",value: item.hex_id? item.hex_id.toUpperCase() : null },
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.app_name },
        { title: "join_eui/app_eui", value: item.join_eui? item.join_eui.toUpperCase() :null},
        { title: "Data Source", value: item.data_collector },
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

  ModalTitle = (props) => {
    /*
    * porps:
    *   type: string, ["gateway", "device"]
    *   hex_id: string, device id
    *   name: string, device name (optional)
    */
    const { name, hex_id, type } = props;
    return (
      <div style={{display: "inline-block", verticalAlign: "middle", marginRight: "20px"}}>
        {(name && name.toUpperCase()) ||
          ( hex_id && hex_id.toUpperCase() &&
            type &&
            `${type.toUpperCase()}: ${hex_id.toUpperCase()}`) ||
          (type && type.toUpperCase())}
      </div>
    );

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
        onClose={this.handleClose}
      >
        <Modal.Header>
            <span style={{marginLeft: "10px", verticalAling: "middle"}}>
              {this.props.loading &&
                <Skeleton width="30%"/>
              }
              {!this.props.loading &&
                <React.Fragment>
                  <this.ModalTitle name={item.name} type={item.type} hex_id={item.hex_id} />
                  <ImportanceLabel importance={item.importance}/>
                </React.Fragment>
              }
            </span>

          <div style={{ display: "inline-block", float: "right" }}>
            {this.props.onNavigate && (
              <Button
                loading={this.props.loading}
                floated={"left"}
                disabled={isFirst || this.props.loading}
                onClick={() => this.handlePrev()}
                content="Previous"
              />
            )}

            {this.props.onNavigate && (
              <Button
                loading={this.props.loading}
                floated={"left"}
                disabled={isLast || this.props.loading}
                onClick={() => this.handleNext()}
                content="Next"
              />
            )}
          </div>
        </Modal.Header>
        <Modal.Content id="modal-content">
          {!this.props.loading && (
            <Grid divided id="modal-content-grid">
              <Grid.Row>
                <Grid.Column width={5} className="modal-content-grid">
                  <ItemDetailsIcon item={item} />
                  <strong>Geolocation:</strong>
                  <Geolocation location={item.location} />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Grid.Row className="modal-content-grid">
                    <strong>Labels: </strong>
                    {this.showTags(item.tags)}{" "}
                    <TagSelector
                      alreadyAssignTags={item.tags}
                      onSelection={this.hanldleTagSelected}
                    />
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
          )}
          {this.props.loading && (
            <LoaderComponent
              loadingMessage="Loading details ..."
              style={{ marginBottom: 20 }}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.handleClose()} content="Close" />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InventoryDetailsModal;
