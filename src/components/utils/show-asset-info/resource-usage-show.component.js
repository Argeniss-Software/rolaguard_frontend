import * as React from "react";
import { Grid, Table } from "semantic-ui-react";
import NumberFormat from "react-number-format";
import WifiIndicator from "react-wifi-indicator";
import moment from "moment";
import DBMToSignalStrength from "../wifi-signal-indicator/DBMToSignalStrength";
import ShowPacketsStatistics from "../../resource-usage/show-packets-statistics.component";
import "./resource-usage-show.component.css"
import statusImages from "../../utils/wifi-signal-indicator/images"
import EmptyComponent from "../../utils/empty.component"
import _ from "lodash"

const ShowResourceUssage = (props) => {
  const normalizedType =
    _.get(props, 'asset.type') &&
    !["gateway", "device"].includes(props.asset.type.toLowerCase().trim())
      ? ""
      : props.asset.type.toLowerCase().trim();
      
  const isDevice = normalizedType === "device";
  
  return (
    <Grid divided>
      <Grid.Row>
        <Grid.Column width={6}>
          <Table compact="very">
            <Table.Body>
              <Table.Row>
                <Table.Cell>LAST MESSAGE RECEIVED:</Table.Cell>
                <Table.Cell className="bold">
                  {moment.unix(props.asset.last_activity).fromNow()} (
                  {moment
                    .unix(props.asset.last_activity)
                    .format("MM/DD/YYYY hh:mm:ss a")}
                  )
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>FREQUENCY OF MESSAGES:</Table.Cell>
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
                <Table.Cell>SIGNAL STRENGTH (RSSI):</Table.Cell>
                <Table.Cell className="bold">
                  {!isDevice && "N/A"}
                  {isDevice && (
                    <React.Fragment>
                      <WifiIndicator
                        strength={DBMToSignalStrength(props.asset.max_rssi)}
                        statusImages={statusImages}
                        style={{
                          height: 20,
                          verticalAlign: "bottom",
                        }}
                      />

                      <span>{DBMToSignalStrength(props.asset.max_rssi)}</span>

                      {props.asset.max_rssi && (
                        <NumberFormat
                          value={props.asset.max_rssi}
                          displayType={"text"}
                          prefix={"("}
                          suffix={" dBm)"}
                          decimalScale="1"
                        />
                      )}
                    </React.Fragment>
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>SNR:</Table.Cell>
                <Table.Cell>
                  {!isDevice && "N/A"}
                  {isDevice && (
                    <strong>
                      <NumberFormat
                        value={props.asset.max_lsnr}
                        suffix=" dB"
                        displayType={"text"}
                        decimalScale="1"
                      />
                    </strong>
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>PAYLOAD SIZE:</Table.Cell>
                <Table.Cell>
                  {!isDevice && "N/A"}
                  {isDevice && (
                    <strong>
                      <NumberFormat
                        value={props.asset.payload_size}
                        suffix=" bytes"
                        displayType={"text"}
                        decimalScale="1"
                      />
                    </strong>
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell># OF GATEWAYS CONNECTED TO:</Table.Cell>
                <Table.Cell>
                  <strong>{props.asset.ngateways_connected_to}</strong>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={4} className="aligned text-center">
          <h5 class="attached header top">Messages on the last 24 Hours</h5>
          <div className="aligned text-center">
            <ShowPacketsStatistics
              packets_down={props.asset.packets_down}
              packets_up={props.asset.packets_up}
              packets_lost={props.asset.packets_lost}
              headerColorLine=""
              type={props.asset.type}
            ></ShowPacketsStatistics>
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <EmptyComponent emptyMessage="WIP: Signal strength graph and SNR of last 10 packages" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ShowResourceUssage;
