import * as React from "react";
import _ from "lodash";
import { Table, Popup } from "semantic-ui-react";
import Tag from "../../utils/tags/tag.component";
import ImportanceLabel from "../../utils/importance-label.component";
import ShowDeviceState from "../show-device-state.component";
import ShowDeviceIcon from "../show-device-icon.component";
import AssetIdComponent from "../asset-id.component";
import NumberFormat from "react-number-format";
import moment from "moment";

const ShowInventory = (props) => {
  return (
    <Table color="black" compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="5" className="bold">
            <ShowDeviceState state={props.inventory.connected} />
            <ShowDeviceIcon
              type={
                props.inventory.type &&
                !["gateway", "device"].includes(
                  props.inventory.type.toLowerCase().trim()
                )
                  ? "unknown"
                  : props.inventory.type
              }
            ></ShowDeviceIcon>{" "}
            <AssetIdComponent type={props.inventory.type} id={props.inventory.hex_id} />
            {"  "}
            <ImportanceLabel importance={props.inventory.importance} />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell collapsing>Name:</Table.Cell>
          <Table.Cell>
            <strong>{props.inventory.name}</strong>
          </Table.Cell>
          <Table.Cell collapsing>Last activity:</Table.Cell>
          <Table.Cell collapsing>
            <Popup
              trigger={
                <strong>{moment(props.inventory.last_activity).fromNow()}</strong>
              }
              position="bottom left"
            >
              <Popup.Header>Las activity</Popup.Header>
              <Popup.Content>
                {moment(props.inventory.last_activity).format(
                  "dddd, MMMM Do, YYYY h:mm:ss A"
                )}
              </Popup.Content>
            </Popup>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Vendor:</Table.Cell>
          <Table.Cell>
            <strong>{props.inventory.vendor}</strong>
          </Table.Cell>
          <Table.Cell collapsing>Activity Freq.</Table.Cell>
          <Table.Cell collapsing>
            <Popup
              trigger={
                <strong>
                  {moment
                    .duration(props.inventory.activity_freq || 0, "seconds")
                    .humanize()}
                </strong>
              }
              position="bottom left"
            >
              <Popup.Header>Frequency of messages</Popup.Header>
              <Popup.Content>
                <NumberFormat
                  value={(props.inventory.activity_freq || 0).toFixed(1)}
                  displayType={"text"}
                  suffix={" s."}
                  decimalScale="1"
                />
              </Popup.Content>
            </Popup>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>App name:</Table.Cell>
          <Table.Cell>
            <strong>{props.inventory.app_name}</strong>
          </Table.Cell>
          <Table.Cell>{/*JSON.stringify(props.inventory.location)*/}</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Data collector:</Table.Cell>
          <Table.Cell>
            <strong>{props.inventory.data_collector}</strong>
          </Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Tags:</Table.Cell>
          <Table.Cell>
            {!_.isEmpty(props.inventory.tags) &&
              props.inventory.tags.map((tag) => {
                return (
                  <Tag
                    key={tag.id}
                    name={tag.name}
                    color={tag.color}
                    textColor="#FFFFFF"
                  />
                );
              })}
          </Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default ShowInventory;
