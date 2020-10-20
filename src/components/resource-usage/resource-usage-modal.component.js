import React from "react";
import { Button, Modal, Icon, Grid, Table, Popup, Segment } from "semantic-ui-react";
import ShowDeviceState from "../utils/show-device-state.component"
import ShowDeviceIcon  from "../utils/show-device-icon.component";
import AssetIdComponent from "../utils/asset-id.component";
import PacketsGraph from "../utils/show-asset-info/resource-usage/packets-graph-component";
import _ from 'lodash'
import AssetLink from "../utils/asset-link.component"
import moment from 'moment'
import ShowMessagesSummary from "./show-message-summary.component"
import ShowMessageFrequency from "../utils/show-asset-info/resource-usage/show-message-frequency.component"
import ShowRequestsStatistics from "./show-requests-statistics.component"

const ModalResourceUsage = (props) => {
  
  const closeModal = () => {
    if (_.isFunction(props.onClose)) {
      props.onClose()
    }
  }
  
  const normalizedType = props.type && props.type.toLowerCase().trim();
  const isDevice = normalizedType === "device";

  return (
    <Modal
      closeOnEscape
      closeIcon
      open={props.open}
      size="large"
      onClose={() => closeModal()}
    >
      <Modal.Header>
        <ShowDeviceState state={props.asset.connected} />
        &nbsp;&nbsp;&nbsp;
        <ShowDeviceIcon type={props.asset.type}></ShowDeviceIcon>
        &nbsp;
        {_.get(props, "asset.type")
          ? props.asset.type.toUpperCase() + ": "
          : ""}
        <AssetIdComponent
          type={props.asset.type}
          id={props.asset.id}
          hexId={props.asset.hex_id}
          showAsLink={false}
        />
        <div style={{ float: "right" }}>
          <Button
            icon
            color="blue"
            basic
            labelPosition="left"
            floated={"left"}
            style={{ marginRight: "3em" }}
          >
            <AssetLink
              id={props.asset.id}
              type={props.asset.type}
              title="VIEW ASSET 360"
            />
            <Icon name="linkify" />
          </Button>
        </div>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Grid>
            <Grid.Row>
              <Grid.Column width={isDevice ? 12 : 16}>
                <Table celled compact color="black" style={{ height: "100%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>DEV ADDR</Table.HeaderCell>
                      <Table.HeaderCell>NAME</Table.HeaderCell>
                      <Table.HeaderCell collapsing>
                        LAST MESSAGE
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        MESSAGES <i>(U/D/L)</i>
                      </Table.HeaderCell>
                      <Table.HeaderCell collapsing>FREQUENCY</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Cell>{props.asset.dev_addr}</Table.Cell>
                    <Table.Cell>{props.asset.name}</Table.Cell>
                    <Table.Cell collapsing>
                      <Popup
                        trigger={
                          <span>
                            {moment.unix(props.asset.last_activity).fromNow()}
                          </span>
                        }
                        position="bottom left"
                      >
                        <Popup.Header>Last message received</Popup.Header>
                        <Popup.Content>
                          {moment
                            .unix(props.asset.last_activity)
                            .format("dddd, MMMM Do, YYYY h:mm:ss A")}
                        </Popup.Content>
                      </Popup>
                    </Table.Cell>
                    <Table.Cell width={6}>
                      <ShowMessagesSummary
                        type={props.asset.type}
                        packets_down={props.asset.packets_down}
                        packets_lost={props.asset.packets_lost}
                        packets_up={props.asset.packets_up}
                      ></ShowMessagesSummary>
                    </Table.Cell>
                    <Table.Cell
                      collapsing
                      className={`aligned pull-left ${
                        props.asset.connected ? "" : "lightgray"
                      }`}
                    >
                      <ShowMessageFrequency asset={props.asset} />
                    </Table.Cell>
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column width={4}>
                {isDevice && (
                  <Popup
                    trigger={
                      <div>
                        <ShowRequestsStatistics asset={props.asset} />
                      </div>
                    }
                    content="Statistics of last 24 hours"
                  />
                )}
              </Grid.Column>
            </Grid.Row>
            {props.asset.type !== "gateway" && (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment>
                    <PacketsGraph type={props.asset.type} id={props.asset.id} />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={() => closeModal()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalResourceUsage;