import * as React from "react";
import _ from "lodash";
import { Table, Popup, Label, Grid, Segment } from "semantic-ui-react";
import Tag from "../../utils/tags/tag.component";
import ImportanceLabel from "../../utils/importance-label.component";
import ShowDeviceState from "../show-device-state.component";
import ShowDeviceIcon from "../show-device-icon.component";
import AssetIdComponent from "../asset-id.component";
import NumberFormat from "react-number-format";
import moment from "moment";
import TruncateMarkup from "react-truncate-markup";

const ShowInventory = (props) => {
  const tagsLeftEllipsis = (node) => {
    const tagsRendered = node.props.children;
    return (
      <Label circular color="grey" key="grey">
        + {node.props.dataCount - tagsRendered.length}
      </Label>
    );
  };

  return (
    <div class="column">
      <h5
        class="ui black inverted top attached header"
        style={{ backgroundColor: "black", fontSize: "20px" }}
      >
        <div>
          <ShowDeviceState state={props.inventory.connected} />
          &nbsp;&nbsp;&nbsp;
          <ShowDeviceIcon
            type={
              props.inventory.type &&
              !["gateway", "device"].includes(
                props.inventory.type.toLowerCase().trim()
              )
                ? "unknown"
                : props.inventory.type
            }
          ></ShowDeviceIcon>
          &nbsp;
          {_.get(props, "inventory.type")
            ? props.inventory.type.toUpperCase() + ": "
            : ""}
          <AssetIdComponent
            type={props.inventory.type}
            id={props.inventory.hex_id}
          />
          &nbsp;&nbsp;&nbsp;
          <Popup
            trigger={
              <ImportanceLabel importance={props.inventory.importance} />
            }
          >
            The importance value indicates the user-defined relevance of the
            device into the organization. Can be set for each asset in the
            Inventory section.
          </Popup>
        </div>
      </h5>
      <Segment attached>
        <Grid columns={16} columns="equal">
          <Grid.Column flex key={5}>
            <Table striped style={{ height: "100%" }}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>NAME:</Table.Cell>
                  <Table.Cell>
                    <strong>{props.inventory.name}</strong>
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
                    <strong>{props.inventory.vendor}</strong>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell collapsing>APPLICATION:</Table.Cell>
                  <Table.Cell>
                    <strong>{props.inventory.app_name}</strong>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell collapsing>JOIN EUI/APP EUI:</Table.Cell>
                  <Table.Cell>
                    <strong>{props.inventory.join_eui}</strong>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell collapsing>DATA SOURCE:</Table.Cell>
                  <Table.Cell>
                    <strong>{props.inventory.data_collector}</strong>
                  </Table.Cell>
                </Table.Row>

                {/*<Table.Row>
          <Table.Cell>LAST ACTIVITY:</Table.Cell>
          <Table.Cell>
            {" "}
            <Popup
              trigger={
                <strong>
                  {moment(props.inventory.last_activity).fromNow()}
                </strong>
              }
              position="bottom left"
            >
              <Popup.Header>Last activity</Popup.Header>
              <Popup.Content>
                {moment(props.inventory.last_activity).format(
                  "dddd, MMMM Do, YYYY h:mm:ss A"
                )}
              </Popup.Content>
            </Popup>
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>ACTIVITY FREQ:</Table.Cell>
          <Table.Cell>
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
              <Popup.Header>FREQUENCY OF MESSAGES</Popup.Header>
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
            </Table.Row>*/}
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column flex key={5}>
            <Table style={{ height: "100%" }}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>LABELS:</Table.Cell>
                  <Table.Cell>
                    {_.get(props, ".inventory.tags") && (
                      <TruncateMarkup
                        lines={1}
                        lineHeight="30px"
                        ellipsis={tagsLeftEllipsis}
                      >
                        <div
                          style={{ width: "250px" }}
                          dataCount={props.inventory.tags.length}
                        >
                          {props.inventory.tags.map((tag) => {
                            return (
                              <TruncateMarkup.Atom>
                                <Tag
                                  key={tag.id}
                                  name={tag.name}
                                  color={tag.color}
                                  textColor="#FFFFFF"
                                />
                              </TruncateMarkup.Atom>
                            );
                          })}
                        </div>
                      </TruncateMarkup>
                    )}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>GEOLOCATION:</Table.Cell>
                  <Table.Cell>
                    {JSON.stringify(props.inventory.location)}
                    here a map!
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column flex key={5}>
            <Table style={{ height: "100%" }}>
              <Table.Body>a Graph?</Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};

export default ShowInventory;
