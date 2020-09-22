import React, {useState} from "react";
import { Grid, Table, Divider } from "semantic-ui-react";
import _ from "lodash";
import NumberFormat from "react-number-format";
import WifiIndicator from "react-wifi-indicator";
import moment from "moment";
import DBMToSignalStrength from "../../wifi-signal-indicator/DBMToSignalStrength";
import ShowPacketsStatistics from "../../../resource-usage/show-packets-statistics.component";
import "./resource-usage-show.component.css";
import statusImages from "../../../utils/wifi-signal-indicator/images";
import AssociatedAsset from "../../../utils/show-asset-info/associated-asset.component"
import { MobXProviderContext } from "mobx-react";

/*
* This component show the resource usage (network overview) info of a gateway or device
* 
* @params asset Object
*/ 
const ResourceUsageInfo = (props) => {
  const normalizedType =
    _.get(props, "asset.type") &&
    !["gateway", "device"].includes(props.asset.type.toLowerCase().trim())
      ? ""
      : props.asset.type.toLowerCase().trim();

  const isDevice = normalizedType === "device";
  const { globalConfigStore } = React.useContext(MobXProviderContext);

  return (
    <React.Fragment>
      <Grid.Row>
        <Table basic celled striped compact size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell>LAST MESSAGE RECEIVED:</Table.Cell>
              <Table.Cell className="bold">
                {moment.unix(props.asset.last_activity).fromNow()} (
                {moment
                  .unix(props.asset.last_activity)
                  .format(globalConfigStore.dateFormats.moment.dateTimeFormat)}
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

                    <span> {DBMToSignalStrength(props.asset.max_rssi)}</span>

                    {props.asset.max_rssi && (
                      <React.Fragment>
                        <span> (</span>
                        <NumberFormat
                          value={props.asset.max_rssi}
                          displayType={"text"}
                          suffix={" dBm)"}
                          decimalScale="1"
                        />
                      </React.Fragment>
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
            {isDevice && (
              <Table.Row>
                <Table.Cell>
                  {isDevice && (
                    <span>
                      CONNECTED TO{" "}
                      <strong>{props.asset.ngateways_connected_to} </strong>
                      GATEWAYS:
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div style={{ wordBreak: "break-all" }}>
                    <AssociatedAsset
                      type={normalizedType}
                      id={props.asset.id}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Grid.Row>
      <Divider />
      <Grid.Row>
        <ShowPacketsStatistics
          packets_down={props.asset.packets_down}
          packets_up={props.asset.packets_up}
          packets_lost={props.asset.packets_lost}
          headerColorLine="black"
          type={props.asset.type}
        >
          <strong>Messages on the last 24 hours</strong>
        </ShowPacketsStatistics>
      </Grid.Row>
    </React.Fragment>
  );
};

export default ResourceUsageInfo;
