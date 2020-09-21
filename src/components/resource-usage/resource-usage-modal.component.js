import React, {useState, useEffect} from "react";
import { Button, Modal, Icon, Grid, Table, Popup, Segment, Divider} from "semantic-ui-react";
import ShowDeviceState from "../utils/show-device-state.component"
import ShowDeviceIcon  from "../utils/show-device-icon.component";
import AssetIdComponent from "../utils/asset-id.component";
import PacketsGraph from "../utils/show-asset-info/packets-graph-component";
import _ from 'lodash'
import AssetLink from "../utils/asset-link.component"
import NumberFormat from "react-number-format"
import moment from 'moment'
import ShowMessagesSummary from "./show-message-summary.component"

const ModalResourceUsage = (props) => {
  const [open, setOpen] = useState(props.openModal || true);
  
  useEffect(() => {
    return () => {
      setOpen(false)
    }
  }, [])

  const closeModal = () => {
    setOpen(false)
    if (_.isFunction(props.onClose)) {
      props.onClose()
    }
  }

  return (
    <Modal
      centered={false}
      closeIcon
      open={open}
      onClose={() => closeModal()}
      onOpen={() => {
        setOpen(true);
      }}
      size="large"
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
              <Grid.Column width={16}>
                <Table className="animated fadeIn" celled compact="very" color="black">
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
                      {props.asset.activity_freq !== null && (
                        <Popup
                          trigger={
                            <span>
                              {moment
                                .duration(
                                  props.asset.activity_freq || 0,
                                  "seconds"
                                )
                                .humanize()}
                            </span>
                          }
                          position="bottom left"
                        >
                          <Popup.Header>Frequency of messages</Popup.Header>
                          <Popup.Content>
                            <NumberFormat
                              value={(props.asset.activity_freq || 0).toFixed(
                                1
                              )}
                              displayType={"text"}
                              suffix={" s."}
                              decimalScale="1"
                            />
                          </Popup.Content>
                        </Popup>
                      )}
                    </Table.Cell>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment>
                  <PacketsGraph type={props.asset.type} id={props.asset.id} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
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