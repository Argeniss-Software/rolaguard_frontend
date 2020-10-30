import React, { useState } from "react";
import { Icon, Table, Popup, Grid } from "semantic-ui-react";

import AssetIdComponent from "../utils/asset-id.component";
import ShowDeviceIcon from "../utils/show-device-icon.component";
import ShowDeviceState from "../utils/show-device-state.component";
import ShowMessagesSummary from "./show-message-summary.component";
import ShowMessageFrequency from "../utils/show-asset-info/resource-usage/show-message-frequency.component"
import EmptyComponent from "../utils/empty.component";
import WifiIndicator from "react-wifi-indicator";
import NumberFormat from "react-number-format";
import moment from "moment";
import SignalStrengthHelp from "../utils/wifi-signal-indicator/signal-strength-help.component";
import DBMToSignalStrength from "../utils/wifi-signal-indicator/DBMToSignalStrength";
import statusImages from "../utils/wifi-signal-indicator/images";
import "./resource-usage.component.css";
import { observer } from "mobx-react";
import ModalResourceUsage from "./resource-usage-modal.component";
import _ from "lodash";
import TruncateMarkup from "react-truncate-markup";

const ResourceUsageList = (props) => {
  const [itemSelected, setItemSelected] = useState(null);

  const closeModal = () => {
    setItemSelected(null);
  };

  const showModal = (data) => {
    const { item } = data;
    setItemSelected(item);
  };

  return (
    <React.Fragment>
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
            <Table.HeaderCell collapsing>DEV ADDR</Table.HeaderCell>
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
                    RSSI
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
            <Table.HeaderCell
              collapsing
              style={{ textAlign: "center" }}
              className="hide-old-computer"
            >
              SNR
            </Table.HeaderCell>
            <Table.HeaderCell
              collapsing
              className="hide-old-computer"
              style={{ textAlign: "center" }}
            >
              Payload
            </Table.HeaderCell>
            <Table.HeaderCell
              collapsing
              style={{ textAlign: "center" }}
              className="hide-old-computer"
            >
              <Popup
                flowing
                size="mini"
                trigger={<span style={{ cursor: "pointer" }}># GW</span>}
                basic
                content="Number of gateways connected to"
              ></Popup>
            </Table.HeaderCell>
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
                    <Table.Cell
                      style={{ textAlign: "center" }}
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      <ShowDeviceState state={item.connected} />
                      <ShowDeviceIcon type={item.type}></ShowDeviceIcon>
                    </Table.Cell>
                    <Table.Cell>
                      <AssetIdComponent
                        type={item.type}
                        hexId={item.hex_id}
                        id={item.id}
                      />
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      {_.toUpper(item.dev_addr)}
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      {item.name}
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      <Popup
                        trigger={
                          <span>
                            {moment.unix(item.last_activity).fromNow()}
                          </span>
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
                    <Table.Cell
                      width={3}
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      <ShowMessagesSummary
                        type={item.type}
                        packets_down={item.packets_down}
                        packets_lost={item.packets_lost}
                        packets_up={item.packets_up}
                      ></ShowMessagesSummary>
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => showModal({ item: item, index: index })}
                      className={`aligned pull-left ${
                        item.connected ? "" : "lightgray"
                      }`}
                    >
                      <ShowMessageFrequency asset={item} />
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => showModal({ item: item, index: index })}
                      collapsing
                      style={{ padding: "0px" }}
                      className={`aligned pull-left ${
                        item.connected ? "" : "lightgray"
                      }`}
                    >
                      <Grid>
                        <Grid.Row>
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
                              content={DBMToSignalStrength(item.max_rssi, true)}
                            ></Popup>
                          )}
                          <TruncateMarkup>
                            <div>
                              <TruncateMarkup.Atom key={item.id}>
                                <NumberFormat
                                  value={item.max_rssi}
                                  displayType={"text"}
                                  suffix={" dBm"}
                                  decimalScale="1"
                                />
                              </TruncateMarkup.Atom>
                            </div>
                          </TruncateMarkup>
                        </Grid.Row>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell
                      style={{ textAlign: "center" }}
                      className={
                        (item.connected ? "" : "lightgray", "hide-old-computer")
                      }
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      <NumberFormat
                        value={item.max_lsnr}
                        suffix=" dB"
                        displayType={"text"}
                        decimalScale="1"
                      />
                    </Table.Cell>
                    <Table.Cell
                      style={{ textAlign: "center" }}
                      className={
                        (item.connected ? "" : "lightgray", "hide-old-computer")
                      }
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      <NumberFormat
                        value={item.payload_size}
                        displayType={"text"}
                        suffix=" bytes"
                        decimalScale="1"
                      />
                    </Table.Cell>

                    <Table.Cell
                      style={{ textAlign: "center" }}
                      className={
                        (item.connected ? "" : "lightgray", "hide-old-computer")
                      }
                      onClick={() => showModal({ item: item, index: index })}
                    >
                      <NumberFormat
                        value={item.ngateways_connected_to}
                        displayType={"text"}
                        decimalScale="1"
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        )}
      </Table>

      {!_.isNull(itemSelected) && (
        <ModalResourceUsage
          open={!_.isNull(itemSelected)}
          type={itemSelected.type}
          asset={itemSelected}
          onClose={closeModal}
        />
      )}
    </React.Fragment>
  );
};

export default observer(ResourceUsageList);
