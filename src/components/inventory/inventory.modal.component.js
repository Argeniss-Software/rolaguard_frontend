import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import {
  Modal,
  Button,
  Grid,
  Table,
  Divider,
  Icon,
  Confirm,
} from "semantic-ui-react";
import Skeleton from "react-loading-skeleton";
import * as HttpStatus from "http-status-codes";
import _ from "lodash";

import "./inventory.modal.component.css";
import Tag from "../utils/tags/tag.component";
import TagSelector from "../utils/tags/tag.selector.component";
import LoaderComponent from "../utils/loader.component";
import ItemDetailsIcon from "./inventory.modal.icon.component";
import ImportanceLabel from "../utils/importance-label.component";
import Geolocation from "../utils/geolocation/geolocation.component";
import AssetLink from "../utils/asset-link.component";
import moment from "moment";
import NotAvailableComponent from "../utils/not-available-value/not-available-value.component";

@inject("tagsStore", "commonStore", "globalConfigStore")
@observer
class InventoryDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      modalOpen: true,
      item: this.props.selectedItem.item,
      activeIndex: this.props.selectedItem.index,
      removalConfirmOpen: false,
      tagToRemove: null,
    };
    this.handleTagSelected = this.handleTagSelected.bind(this);
    this.handleTagRemoval = this.handleTagRemoval.bind(this);
  }

  showConfirmAndSetTag(tag) {
    this.setState({ removalConfirmOpen: true });
    this.setState({ tagToRemove: tag });
  }

  handleConfirm = () => this.setState({ removalConfirmOpen: false });
  handleConfirmCancel = () => this.setState({ removalConfirmOpen: false });

  UNSAFE_componentWillMount() {
    this.getGatewaysLocations();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState(
      {
        item: newProps.selectedItem.item,
        activeIndex: newProps.selectedItem.index,
      },
      this.getGatewaysLocations
    );
  }

  getGatewaysLocations() {
    const paramsId = {
      type: _.lowerCase(this.props.selectedItem.item.type),
      id: this.props.selectedItem.item.id,
    };
    this.setState({ isLoading: true });

    this.props.commonStore.getData("inventory", paramsId).then((result) => {
      if (result.status === HttpStatus.OK) {
        this.setState(
          {
            gatewaysLocation: result.data.gateway_locations,
          },
          () => this.setState({ isLoading: false })
        );
      }
    });
  }

  handleClose = (e) => {
    this.setState({ modalOpen: false });
    this.props.onClose();
  };

  handleNext = (e) => {
    this.props.onNavigate(+1);
  };

  handlePrev = (e) => {
    this.props.onNavigate(-1);
  };

  getParameterValue(parameters, parameterName) {
    return parameters[parameterName];
  }

  showTags(tags) {
    return tags.map((tag) => {
      return (
        <>
          <Tag
            key={tag.id}
            name={tag.name}
            removable={true}
            color={tag.color}
            id={tag.id}
            onRemoveClick={() => this.showConfirmAndSetTag(tag)}
          />
          <Confirm
            open={this.state.removalConfirmOpen}
            onCancel={this.handleConfirmCancel}
            onConfirm={() => this.handleTagRemoval(this.state.tagToRemove)}
          />
        </>
      );
    });
  }

  showTechnicalDetails(item, dateFormat) {
    let table = [];

    if (item && item.type && item.type.trim().toLowerCase() === "device") {
      table = [
        { title: "Item type", value: item.type },
        {
          title: "DevEUI",
          value: item.hex_id ? (
            item.hex_id.toUpperCase()
          ) : (
            <NotAvailableComponent />
          ),
        },
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.app_name },
        {
          title: "JOIN EUI/APP EUI",
          value: item.join_eui ? (
            item.join_eui.toUpperCase()
          ) : (
            <NotAvailableComponent />
          ),
        },
        {
          title: "First Activity",
          value: _.isNull(item.first_activity) ? (
            <NotAvailableComponent />
          ) : (
            moment.unix(item.first_activity).format(dateFormat)
          ),
        },
        { title: "Data Source", value: item.data_collector },
      ];
    }
    if (item && item.type && item.type.trim().toLowerCase() === "gateway") {
      table = [
        { title: "Item type", value: item.type },
        {
          title: "Gateway ID",
          value: item.hex_id ? (
            item.hex_id.toUpperCase()
          ) : (
            <NotAvailableComponent />
          ),
        },
        { title: "Name", value: item.name },
        { title: "Vendor", value: item.vendor },
        { title: "Application", value: item.app_name },
        {
          title: "JOIN EUI/APP EUI",
          value: item.join_eui ? (
            item.join_eui.toUpperCase()
          ) : (
            <NotAvailableComponent />
          ),
        },
        {
          title: "First Activity",
          value: _.isNull(item.first_activity) ? (
            <NotAvailableComponent />
          ) : (
            moment.unix(item.first_activity).format(dateFormat)
          ),
        },
        { title: "Data Source", value: item.data_collector },
      ];
    }

    if (table === 0) {
      return (
        <Table.Row>
          <Table.Cell>
            Oops, there is no technical details to show. This must be an error,
            please contact support.
          </Table.Cell>
        </Table.Row>
      );
    }

    return table
      .filter((row) => row.value)
      .map((row) => {
        return (
          <Table.Row key={row.title}>
            <Table.Cell
              width="3"
              className="technical-details-table-row-left"
              style={{ borderTop: "1px solid lightgray !important" }}
            >
              <i>{row.title}</i>
            </Table.Cell>
            <Table.Cell
              width="3"
              className={"technical-details-table-row-right"}
            >
              <b>{row.value}</b>
            </Table.Cell>
          </Table.Row>
        );
      });
  }

  handleTagSelected(tag) {
    let { item } = this.state;
    this.props.tagsStore.assignTag(tag, item).then(() => {
      item.tags.push(tag);
      this.setState({
        item,
      });
    });
  }

  handleTagRemoval(tag) {
    const { item } = this.state;
    this.props.tagsStore.removeTag(tag, item).then(() => {
      item.tags = item.tags.filter((t) => t.id !== tag.id);
      this.setState({
        item,
        removalConfirmOpen: false,
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
      <div
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "20px",
        }}
      >
        {(name && name.toUpperCase()) ||
          (hex_id &&
            hex_id.toUpperCase() &&
            type &&
            `${type.toUpperCase()}: ${hex_id.toUpperCase()}`) ||
          (type && type.toUpperCase())}
      </div>
    );
  };

  render() {
    const { modalOpen } = this.state;
    const { index, isFirst, isLast } = this.props.selectedItem;
    const { assets } = this.props;
    const item = assets[index];
    const dateFormat =
      this.props.globalConfigStore.dateFormats.moment.dateTimeFormat;

    return (
      <Modal
        closeOnEscape
        closeIcon
        open={modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <span style={{ marginLeft: "10px", verticalAling: "middle" }}>
            {this.state.isLoading && <Skeleton width="30%" />}
            {!this.state.isLoading && (
              <React.Fragment>
                <this.ModalTitle
                  name={item.name}
                  type={item.type}
                  hexId={item.hex_id}
                />
                <ImportanceLabel importance={item.importance} />
              </React.Fragment>
            )}
          </span>

          <div style={{ display: "inline-block", float: "right" }}>
            <Button
              icon
              color="blue"
              basic
              labelPosition="left"
              floated={"left"}
              style={{ marginRight: "3em" }}
            >
              <AssetLink
                id={this.state.item.id}
                type={this.state.item.type}
                title="360° VIEW"
              />
              <Icon name="linkify" />
            </Button>
            {this.props.onNavigate && (
              <Button
                loading={this.state.isLoading}
                floated={"left"}
                disabled={isFirst || this.state.isLoading}
                onClick={() => this.handlePrev()}
                content="Previous"
              />
            )}
            {this.props.onNavigate && (
              <Button
                loading={this.state.isLoading}
                floated={"left"}
                disabled={isLast || this.state.isLoading}
                onClick={() => this.handleNext()}
                content="Next"
              />
            )}
          </div>
        </Modal.Header>
        <Modal.Content id="modal-content">
          {!this.state.isLoading && (
            <Grid divided id="modal-content-grid">
              <Grid.Row>
                <Grid.Column width={5} className="modal-content-grid">
                  <ItemDetailsIcon item={item} />
                  <strong>Location:</strong>
                  <div style={{ height: "200px", width: "100%" }}>
                    <Geolocation
                      location={item.location}
                      gatewaysLocations={this.state.gatewaysLocation}
                      radius={5000}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Grid.Row className="modal-content-grid">
                    <strong>Labels: </strong>
                    {this.showTags(item.tags)}{" "}
                    <TagSelector
                      alreadyAssignTags={item.tags}
                      onSelection={this.handleTagSelected}
                    />
                  </Grid.Row>
                  <Divider />
                  <Grid.Row className="modal-content-grid">
                    <strong>Details</strong>
                    <div className="asset-details-technical-table">
                      <Table compact="very" celled padded>
                        <Table.Body>
                          {this.showTechnicalDetails(item, dateFormat)}
                        </Table.Body>
                      </Table>
                    </div>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
          {this.state.isLoading && (
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
