import * as React from "react";
import _ from "lodash";
import { Table, Popup, Grid, Segment, Container } from "semantic-ui-react";
import ImportanceLabel from "../../utils/importance-label.component";
import ShowDeviceState from "../show-device-state.component";
import ShowDeviceIcon from "../show-device-icon.component";
import AssetIdComponent from "../asset-id.component";
import Geolocation from "../geolocation/geolocation.component";
import Tag from "../tags/tag.component";
import ShowCurrentIssues from "./current-issues-show.component";
import NotAvailableComponent from "../not-available-value/not-available-value.component";

const ShowInventory = (props) => {
  const [tags] = React.useState(
    props.inventory.tags ? props.inventory.tags : []
  );

  const normalizedType =
    props.inventory.type &&
    !["gateway", "device"].includes(props.inventory.type.toLowerCase().trim())
      ? "unknown"
      : props.inventory.type.toLowerCase().trim();

  return (
    <div className="column">
      <h5
        className="ui black inverted top attached header"
        style={{ backgroundColor: "black", fontSize: "18px", padding: "15px" }}
      >
        <Grid>
          <Grid.Column floated="left" width={13}>
            <ShowDeviceState state={props.inventory.connected} />
            &nbsp;&nbsp;&nbsp;
            <ShowDeviceIcon type={normalizedType}></ShowDeviceIcon>
            &nbsp;
            {_.get(props, "inventory.type")
              ? props.inventory.type.toUpperCase() + ": "
              : ""}
            <AssetIdComponent
              type={props.inventory.type}
              id={props.inventory.id}
              hexId={props.inventory.hex_id}
              showAsLink={false}
            />
            <Popup
              trigger={
                props.inventory.dev_addr && (
                  <span style={{ marginLeft: "10px" }}>
                    | {_.toUpper(props.inventory.dev_addr)}
                  </span>
                )
              }
              content="Device Address"
              size="small"
            />
          </Grid.Column>
          <Grid.Column floated="right" width={3}>
            {props.LayoutHeaderRight}
          </Grid.Column>
        </Grid>
      </h5>
      <Segment attached>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={5}>
              <Table basic celled striped style={{ height: "100%" }}>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell collapsing>NAME:</Table.Cell>
                    <Table.Cell>
                      {props.inventory.name ? (
                        <strong>{props.inventory.name}</strong>
                      ) : (
                        <NotAvailableComponent />
                      )}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing>STATUS:</Table.Cell>
                    <Table.Cell>
                      <ShowDeviceState
                        state={props.inventory.connected}
                        showPopup={false}
                        showLabel={true}
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing>VENDOR:</Table.Cell>
                    <Table.Cell>
                      {props.inventory.vendor ? (
                        <strong>{props.inventory.vendor}</strong>
                      ) : (
                        <NotAvailableComponent />
                      )}
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing>APPLICATION:</Table.Cell>
                    <Table.Cell>
                      {props.inventory.name ? (
                        <strong>{props.inventory.name}</strong>
                      ) : (
                        <NotAvailableComponent />
                      )}

                      {normalizedType === "device" ? (
                        props.inventory.app_name ? (
                          <strong>{props.inventory.app_name}</strong>
                        ) : (
                          <NotAvailableComponent />
                        )
                      ) : (
                        "N/A"
                      )}
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing>JOIN EUI/APP EUI:</Table.Cell>
                    <Table.Cell>
                      {normalizedType === "device" ? (
                        props.inventory.join_eui ? (
                          <strong>{_.toUpper(props.inventory.join_eui)}</strong>
                        ) : (
                          <NotAvailableComponent />
                        )
                      ) : (
                        "N/A"
                      )}
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing>DATA SOURCE:</Table.Cell>
                    <Table.Cell>
                      {props.inventory.data_collector ? (
                        <strong>{props.inventory.data_collector}</strong>
                      ) : (
                        <NotAvailableComponent />
                      )}
                    </Table.Cell>
                  </Table.Row>

                    <Table.Row>
                      <Table.Cell collapsing>
                        <Popup
                          trigger={
                            <span style={{ cursor: "pointer" }}>
                              IMPORTANCE
                            </span>
                          }
                        >
                          The importance value indicates the user-defined
                          relevance of the device into the organization. Can be
                          set for each asset in the Inventory section.
                        </Popup>
                      </Table.Cell>
                      <Table.Cell>
                        <ImportanceLabel
                          importance={props.inventory.importance}
                        />
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell collapsing>LABELS:</Table.Cell>
                      <Table.Cell>
                        {tags.map((tag) => (
                          <Tag
                            key={tag.id}
                            id={tag.id}
                            name={tag.name}
                            color={tag.color}
                            textColor="white"
                            selectable={false}
                            removable={false}
                          />
                        ))}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
            </Grid.Column>
            <Grid.Column width={3}>
              <Segment>
                <div className="text-center aligned" style={{ height: "95%" }}>
                  <strong>LOCATION</strong>
                  <Geolocation
                    location={props.inventory.location}
                    gatewaysLocations={props.inventory.gateway_locations}
                    radius={2000}
                    circleColor="blue"
                  />
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <ShowCurrentIssues
                type={props.inventory.type}
                id={props.inventory.id}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default ShowInventory;
