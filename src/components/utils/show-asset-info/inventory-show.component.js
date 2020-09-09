import * as React from "react";
import _ from "lodash";
import { Table, Popup, Label, Grid, Segment } from "semantic-ui-react";
import Tag from "../../utils/tags/tag.component";
import ImportanceLabel from "../../utils/importance-label.component";
import ShowDeviceState from "../show-device-state.component";
import ShowDeviceIcon from "../show-device-icon.component";
import AssetIdComponent from "../asset-id.component";
import Geolocation from "../geolocation/geolocation.component";
import TagSelectorStandalone from "../tags/tag.selector.standalone.component";
import RemovableTagStandalone from "../tags/removable-tag.standalone.component";

const ShowInventory = (props) => {

  const [ tags, setTags ] = React.useState(props.inventory.tags? props.inventory.tags : []);
  const tagsLeftEllipsis = (node) => {
    const tagsRendered = node.props.children;
    return (
      <Label circular color="grey" key="grey">
        + {node.props.dataCount - tagsRendered.length}
      </Label>
    );
  };

  console.log(props.inventory.tags)

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
              id={props.inventory.id}
              hexId={props.inventory.hex_id}
              showAsLink={false}
            />
          </Grid.Column>
          <Grid.Column floated="right" width={3}>
            {props.LayoutHeaderRight}
          </Grid.Column>
        </Grid>
      </h5>
      <Segment attached>
        <Grid columns={16} columns="equal">
          <Grid.Column flex key={5}>
            <Table compact striped style={{ height: "100%" }}>
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

                <Table.Row>
                  <Table.Cell collapsing>
                    <Popup
                      trigger={
                        <span style={{ cursor: "pointer" }}>IMPORTANCE</span>
                      }
                    >
                      The importance value indicates the user-defined relevance
                      of the device into the organization. Can be set for each
                      asset in the Inventory section.
                    </Popup>
                  </Table.Cell>
                  <Table.Cell>
                    <ImportanceLabel importance={props.inventory.importance} />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell collapsing>LABELS:</Table.Cell>
                  <Table.Cell>
                  {
                    tags.map((tag) =>
                      <RemovableTagStandalone
                        key={tag.id}
                        id={tag.id}
                        name={tag.name}
                        color={tag.color}
                        assetType={props.inventory.type}
                        assetId={props.inventory.id}
                        callback={(tag) => setTags((tags) => tags.filter((t) => t.id !== tag.id))}
                      />
                    )
                  }
                  <TagSelectorStandalone
                    type={props.inventory.type}
                    id={props.inventory.id}
                    alreadyAssignTags={tags? tags : []}
                    callback={(tag) => setTags((tags) => [...tags, tag])}
                  />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column flex key={5}>
            <div className="aligned text-center">
              <strong>Geolocation:</strong>
              <Geolocation location={props.inventory.location} />
            </div>
          </Grid.Column>
          <Grid.Column flex key={5}>
            <div className="aligned text-center">OTHER DATA</div>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};

export default ShowInventory;
