import * as React from "react";
import { Icon, Table, Popup, Grid } from "semantic-ui-react";

import AssetIdComponent from "../utils/asset-id.component";
import ShowDeviceIcon from "../utils/show-device-icon.component";
import ShowDeviceState from "./show-device-state.component";
import ShowMessagesSummary from "./show-message-summary.component";
import EmptyComponent from "../utils/empty.component";
import WifiIndicator, { DBMToSignalStrength } from "react-wifi-indicator";
import NumberFormat from "react-number-format";
import moment from "moment";

const ResourceUsageList = (props) => {
  return (
    <Table striped className="animated fadeIn" basic="very" compact="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <ShowDeviceIcon type={props.criteria.type}></ShowDeviceIcon>
          </Table.HeaderCell>
          <Table.HeaderCell collapsing>ID</Table.HeaderCell>
          <Table.HeaderCell>NAME</Table.HeaderCell>
          <Table.HeaderCell>LAST MESSAGE</Table.HeaderCell>
          <Table.HeaderCell>
            MESSAGES <i>(R/S/L)</i>
          </Table.HeaderCell>
          <Table.HeaderCell>FREQUENCY</Table.HeaderCell>
          <Table.HeaderCell>
            <Icon color="blue" name="wifi" type="icon" />
            SIGNAL STRENGTH
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      

      {props.list.data.length === 0 && (
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan="100%">
              <EmptyComponent emptyMessage="No assets found" />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      )}
      {props.list.data.length > 0 && (
        <Table.Body>
          {!props.list.isLoading &&
            props.list.data &&
            props.list.data.map((item, index) => {
              return (
                <Table.Row key={index} style={{ cursor: "pointer" }}>
                  <Table.Cell style={{ textAlign: "center" }}>
                    <ShowDeviceIcon
                      type={
                        item.type &&
                        !["gateway", "device"].includes(
                          item.type.toLowerCase().trim()
                        )
                          ? "unknown"
                          : item.type
                      }
                    ></ShowDeviceIcon>
                  </Table.Cell>
                  <Table.Cell>
                    <AssetIdComponent type={item.type} id={item.hex_id} />
                  </Table.Cell>
                  <Table.Cell>
                    {ShowDeviceState(item.connected)}
                    {item.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Popup
                      trigger={
                        <span>{moment.unix(item.last_activity).fromNow()}</span>
                      }
                      position="bottom left"
                    >
                      <Popup.Header>Last message received</Popup.Header>
                      <Popup.Content>
                        {moment
                          .unix(item.last_activity)
                          .format("dddd, MMMM Do, YYYY h:mm:ss A")}
                      </Popup.Content>
                    </Popup>
                  </Table.Cell>
                  <Table.Cell>
                    <ShowMessagesSummary
                      packets_down={item.packets_down}
                      packets_lost={item.packets_lost}
                      packets_up={item.packets_up}
                    ></ShowMessagesSummary>
                  </Table.Cell>
                  <Table.Cell
                    title="frequency between packages"
                    className="aligned pull-right"
                  >
                    <NumberFormat
                      value={item.activity_freq}
                      displayType={"text"}
                      prefix={"every "}
                      suffix={" s."}
                      decimalScale="1"
                    />
                  </Table.Cell>
                  <Table.Cell style={{ padding: "0px" }}>
                    <Grid style={{ marginTop: "0px" }}>
                      <Grid.Row style={{ padding: "0px" }}>
                        <Grid.Column width={8} textAlign="right">
                          {item.type.toLowerCase().trim() == "device" && (
                            <WifiIndicator
                              strength={DBMToSignalStrength(item.max_rssi)}
                              style={{
                                height: 20,
                                verticalAlign: "bottom",
                              }}
                            />
                            /*<Progress
                        size="medium"
                        color="green"
                        value={item.signal_strength}
                        total={100}
                        active
                        progress="percent"
                      ></Progress>*/
                          )}
                        </Grid.Column>
                        <Grid.Column width={8} textAlign="left">
                          <strong style={{ marginLeft: "5px" }}>
                            <NumberFormat
                              value={item.max_rssi}
                              displayType={"text"}
                              suffix={" dBm"}
                              decimalScale="1"
                            />
                          </strong>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      )}
    </Table>
  );
};

export default ResourceUsageList;