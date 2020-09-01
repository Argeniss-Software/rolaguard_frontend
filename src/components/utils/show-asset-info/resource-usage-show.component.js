import * as React from "react";
import { Grid, Table } from "semantic-ui-react";
import NumberFormat from "react-number-format";
import AssetIdComponent from "../asset-id.component";
import ShowDeviceIcon from "../show-device-icon.component"
import ShowDeviceState from "../show-device-state.component";
import WifiIndicator from "react-wifi-indicator";
import moment from "moment";
import DBMToSignalStrength from "../wifi-signal-indicator/DBMToSignalStrength";
import ShowPacketsStatistics from "../../resource-usage/show-packets-statistics.component";
import _ from "lodash";
import "./resource-usage-show.component.css"
import statusImages from "../../utils/wifi-signal-indicator/images"

const ShowResourceUssage = (props) => {
  return (
    <Grid divided>
      <Grid.Row>
        <Grid.Column width={7}>
          <Table color="black" compact="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2" className="bold">
                  <ShowDeviceIcon type={props.asset.type}></ShowDeviceIcon>{" "}
                  {_.get(props.asset, "type", "").toUpperCase()} <span>-</span>
                  {props.asset.hex_id}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>TYPE</Table.Cell>
                <Table.Cell className="bold">{props.asset.type}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>ID</Table.Cell>
                <Table.Cell className="bold">
                  <AssetIdComponent
                    type={props.asset.type}
                    id={props.asset.hex_id}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>STATUS</Table.Cell>
                <Table.Cell>
                  <ShowDeviceState
                    state={props.asset.connected}
                    showPopup={false}
                    showLabel={true}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>NAME</Table.Cell>
                <Table.Cell className="bold">{props.asset.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DATA SOURCE</Table.Cell>
                <Table.Cell className="bold">
                  {props.asset.data_collector}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>APPLICATION NAME</Table.Cell>
                <Table.Cell className="bold">{props.asset.app_name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>SIGNAL STRENGTH</Table.Cell>
                <Table.Cell className="bold">
                  {props.asset &&
                    props.asset.type &&
                    props.asset.type.toLowerCase().trim() === "device" && (
                      <WifiIndicator
                        strength={DBMToSignalStrength(props.asset.max_rssi)}
                        statusImages={statusImages}
                        style={{
                          height: 20,
                          verticalAlign: "bottom",
                        }}
                      />
                    )}
                  <span> {DBMToSignalStrength(props.asset.max_rssi)}</span>
                  <NumberFormat
                    value={props.asset.max_rssi}
                    displayType={"text"}
                    prefix="("
                    suffix={" dBm)"}
                    decimalScale="1"
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>

        <Grid.Column width={9}>
          <Grid.Row>
            <Table size="small" color="black">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">
                    MESSAGES STATISTICS
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Row>
                    <Table.Cell>LAST MESSAGE RECEIVED</Table.Cell>
                    <Table.Cell className="bold">
                      {moment.unix(props.asset.last_activity).fromNow()} (
                      {moment
                        .unix(props.asset.last_activity)
                        .format("YYYY/MM/d h:mm:ss A")}
                      )
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>FREQUENCY OF MESSAGES</Table.Cell>
                    <Table.Cell
                      className={`aligned pull-left bold ${
                        props.asset.connected ? "" : "lightgray"
                      }`}
                    >
                      {moment
                        .duration(props.asset.activity_freq || 0, "seconds")
                        .humanize()}{" "}
                      (
                      <NumberFormat
                        value={(props.asset.activity_freq || 0).toFixed(1)}
                        displayType={"text"}
                        suffix={" s"}
                        decimalScale="1"
                      />
                      )
                    </Table.Cell>
                  </Table.Row>
                </Table.Row>
                <Table.Cell>
                  <ShowPacketsStatistics
                    packets_down={props.asset.packets_down}
                    packets_up={props.asset.packets_up}
                    packets_lost={props.asset.packets_lost}
                    headerColorLine=""
                    type={props.asset.type}
                  ></ShowPacketsStatistics>
                </Table.Cell>
              </Table.Body>
            </Table>
            <div></div>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ShowResourceUssage;
