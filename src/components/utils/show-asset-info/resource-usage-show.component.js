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
        <Grid.Column width={10}>
          <Table compact="very">
            <Table.Body>
              {/*<Table.Row>
                <Table.Cell>DATA SOURCE</Table.Cell>
                <Table.Cell className="bold">
                  {props.asset.data_collector}
                </Table.Cell>
              </Table.Row>
              */}
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
                  &nbsp;&nbsp; (
                  <NumberFormat
                    value={props.asset.max_rssi}
                    displayType={"text"}
                    suffix={" dBm)"}
                    decimalScale="1"
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>LSNR</Table.Cell>
                <Table.Cell>
                  <strong></strong>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={6}>
          <ShowPacketsStatistics
            packets_down={props.asset.packets_down}
            packets_up={props.asset.packets_up}
            packets_lost={props.asset.packets_lost}
            headerColorLine=""
            type={props.asset.type}
          ></ShowPacketsStatistics>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ShowResourceUssage;
