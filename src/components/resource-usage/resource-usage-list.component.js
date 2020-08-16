import * as React from "react";
import { Icon, Table, Progress } from "semantic-ui-react";

import AssetIdComponent from "../utils/asset-id.component";
import ShowDeviceIcon from "../utils/show-device-icon.component";
import ShowDeviceState from "./show-device-state.component";
import ShowMessagesSummary from "./show-message-summary.component";
import EmptyComponent from "../utils/empty.component";

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
          <Table.HeaderCell>STATE</Table.HeaderCell>
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

      {props.list.count === 0 && (
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan="100%">
              <EmptyComponent emptyMessage="No assets found" />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      )}

      {props.list.count > 0 && (
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
                    {ShowDeviceState(item.state)}
                    {item.name}
                  </Table.Cell>
                  <Table.Cell>??</Table.Cell>
                  <Table.Cell>
                    {ShowMessagesSummary(
                      item.received,
                      item.sended,
                      item.lost,
                      item.received_p,
                      item.sended_p,
                      item.lost_p
                    )}
                  </Table.Cell>
                  <Table.Cell>{item.package_frequency}</Table.Cell>
                  <Table.Cell>
                    {item.type == "device" && (
                      <Progress
                        size="medium"
                        color="green"
                        value={item.signal_strength}
                        total={100}
                        active
                        progress="percent"
                      ></Progress>
                    )}
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
