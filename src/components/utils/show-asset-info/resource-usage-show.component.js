import React, {useState} from "react";
import { Grid, Table, Segment, Header, Divider } from "semantic-ui-react";
import _ from "lodash";
import NumberFormat from "react-number-format";
import WifiIndicator from "react-wifi-indicator";
import moment from "moment";
import DBMToSignalStrength from "../wifi-signal-indicator/DBMToSignalStrength";
import ShowPacketsStatistics from "../../resource-usage/show-packets-statistics.component";
import "./resource-usage-show.component.css";
import statusImages from "../../utils/wifi-signal-indicator/images";
import PacketsGraph from "./packets-graph-component";
import AssociatedAssetInventoryShow from "../../utils/show-asset-info/associated-asset-inventory-show.component";
import AssociatedAsset from "../../utils/show-asset-info/associated-asset.component"
import GatewayShowInfo from "./gateway-show-info.component"
import { MobXProviderContext } from "mobx-react";


const ShowResourceUssage = (props) => {
  const normalizedType =
    _.get(props, "asset.type") &&
    !["gateway", "device"].includes(props.asset.type.toLowerCase().trim())
      ? ""
      : props.asset.type.toLowerCase().trim();

  const isDevice = normalizedType === "device";
  const { globalConfigStore } = React.useContext(MobXProviderContext);
  const [filterLabelCodes, setFilterLabelCodes] = useState([])

  return (
    <Grid divided="vertically">
      <Grid.Column width={5}>
        <Grid.Row>
          <Table basic celled striped compact size="small">
            <Table.Body>
              <Table.Row>
                <Table.Cell>LAST MESSAGE RECEIVED:</Table.Cell>
                <Table.Cell className="bold">
                  {moment.unix(props.asset.last_activity).fromNow()} (
                  {moment
                    .unix(props.asset.last_activity)
                    .format(
                      globalConfigStore.dateFormats.moment.dateTimeFormat
                    )}
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
      </Grid.Column>
      <Grid.Column width={11}>
        {isDevice && (
          <Segment>
            <PacketsGraph data={props.asset} />
          </Segment>
        )}
        {!isDevice && (
          <Segment stretched placeholder>
            <Grid>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Segment attached>
                    <GatewayShowInfo gatewayId={props.asset.id} />
                  </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                  <AssociatedAssetInventoryShow
                    type={normalizedType}
                    id={props.asset.id}
                    tags={filterLabelCodes}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ShowResourceUssage;
