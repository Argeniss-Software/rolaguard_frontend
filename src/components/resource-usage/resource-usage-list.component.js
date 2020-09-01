import * as React from "react";
import { Icon, Table, Popup, Grid } from "semantic-ui-react";

import AssetIdComponent from "../utils/asset-id.component";
import ShowDeviceIcon from "../utils/show-device-icon.component";
import ShowDeviceState from "../utils/show-device-state.component";
import ShowMessagesSummary from "./show-message-summary.component";
import EmptyComponent from "../utils/empty.component";
import WifiIndicator from "react-wifi-indicator";
import NumberFormat from "react-number-format";
import moment from "moment";
import SignalStrengthHelp from "../utils/wifi-signal-indicator/signal-strength-help.component";
import DBMToSignalStrength from "../utils/wifi-signal-indicator/DBMToSignalStrength";
import statusImages from "../utils/wifi-signal-indicator/images";
import "./resource-usage.component.css";
import {observer} from 'mobx-react';
import ModalResourceUsage from './resource-usage-modal.component'

const ResourceUsageList = (props) => {
  return (
    <Table
      striped
      selectable 
      className="animated fadeIn"
      basic="very"
      compact="very"
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing style={{ textAlign: "center" }}>
            <ShowDeviceIcon
              type={props.criteria.type}
              clickHandler={props.deviceTypeClick}
            ></ShowDeviceIcon>
          </Table.HeaderCell>

          <Table.HeaderCell collapsing>ID</Table.HeaderCell>
          <Table.HeaderCell collapsing>NAME</Table.HeaderCell>
          <Table.HeaderCell collapsing>LAST MESSAGE</Table.HeaderCell>
          <Table.HeaderCell collapsing>
            MESSAGES <i>(U/D/L)</i>
          </Table.HeaderCell>
          <Table.HeaderCell collapsing>FREQUENCY</Table.HeaderCell>
          <Table.HeaderCell collapsing style={{ textAlign: "center" }}>
            <Popup
              flowing
              size="mini"
              trigger={
                <span style={{ cursor: "pointer" }}>
                  <Icon color="blue" name="wifi" type="icon" />
                  SIGNAL STRENGTH
                </span>
              }
              basic
            >
              <Popup.Header>Signal strength references</Popup.Header>
              <Popup.Content>
                <SignalStrengthHelp></SignalStrengthHelp>
              </Popup.Content>
            </Popup>
          </Table.HeaderCell>
          <Table.HeaderCell collapsing style={{textAlign: "center"}}>ACTIONS</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {props &&
        props.list &&
        props.list.data &&
        props.list.data.length === 0 &&
        !props.isLoading && (
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan="100%">
                <EmptyComponent emptyMessage="No assets found" />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      {props && props.list && props.list.data && props.list.data.length > 0 && (
        <Table.Body>
          {!props.isLoading &&
            props.list.data &&
            props.list.data.map((item, index) => {
              return (
                <Table.Row key={index} style={{ cursor: "pointer" }}>
                  <Table.Cell style={{ textAlign: "center" }}>
                    <ShowDeviceState state={item.connected} />
                    <ShowDeviceIcon type={item.type}></ShowDeviceIcon>
                  </Table.Cell>
                  <Table.Cell>
                    <AssetIdComponent type={item.type} id={item.hex_id} />
                  </Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
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
                  <Table.Cell width={3}>
                    <ShowMessagesSummary
                      type={item.type}
                      packets_down={item.packets_down}
                      packets_lost={item.packets_lost}
                      packets_up={item.packets_up}
                    ></ShowMessagesSummary>
                  </Table.Cell>
                  <Table.Cell
                    className={`aligned pull-left ${
                      item.connected ? "" : "lightgray"
                    }`}
                  >
                    {item.activity_freq !== null && (
                      <Popup
                        trigger={
                          <span>
                            {moment
                              .duration(item.activity_freq || 0, "seconds")
                              .humanize()}
                          </span>
                        }
                        position="bottom left"
                      >
                        <Popup.Header>Frequency of messages</Popup.Header>
                        <Popup.Content>
                          <NumberFormat
                            value={(item.activity_freq || 0).toFixed(1)}
                            displayType={"text"}
                            suffix={" s."}
                            decimalScale="1"
                          />
                        </Popup.Content>
                      </Popup>
                    )}
                  </Table.Cell>
                  <Table.Cell
                    collapsing
                    style={{ padding: "0px" }}
                    className={`aligned pull-left ${
                      item.connected ? "" : "lightgray"
                    }`}
                  >
                    <Grid>
                      <Grid.Row style={{ padding: "0px" }}>
                        <Grid.Column width={2} floated="right">
                          {item.type.toLowerCase().trim() === "device" && (
                            <Popup
                              basic
                              trigger={
                                <WifiIndicator
                                  strength={DBMToSignalStrength(item.max_rssi)}
                                  statusImages={statusImages}
                                  style={{
                                    height: 20,
                                    verticalAlign: "bottom",
                                  }}
                                />
                              }
                              content={
                                DBMToSignalStrength(item.max_rssi) ===
                                "DISCONNECTED"
                                  ? "UNUSABLE"
                                  : DBMToSignalStrength(item.max_rssi) ===
                                    "UNUSABLE"
                                  ? "VERY WEAK"
                                  : DBMToSignalStrength(item.max_rssi)
                              }
                            ></Popup>
                          )}
                        </Grid.Column>
                        <Grid.Column width={4} floated="left">
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
                  <Table.Cell style={{textAlign: 'center'}}>
                    <div class="td-actions">
                      <ModalResourceUsage
                        asset={item}
                        id={item.id}
                        type={item.type}
                        tabIndexActive={0}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      )}
    </Table>
  );
};

export default observer(ResourceUsageList);
