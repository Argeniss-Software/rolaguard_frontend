import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Label,
  Grid,
  Pagination,
  Segment,
  Popup,
  Message
} from "semantic-ui-react";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";
import AssetIdComponent from "../asset-id.component";
import ImportanceLabel from "../importance-label.component";
import TruncateMarkup from "react-truncate-markup";
import ShowDeviceState from "../show-device-state.component";
import { MobXProviderContext } from "mobx-react";
import GatewayCirclePackGraph from "./gateway-circle-pack-graph.component";
import HttpStatus from "http-status-codes"
import LoaderComponent from "../loader.component"
import InventoryDetailsModal from "../../inventory/inventory.modal.component"
import moment from 'moment'

const AssociatedAssetInventoryShow = (props) => {
  const { inventoryAssetsStore } = useContext(MobXProviderContext);
  const [errorOnRequest, setErrorOnRequest] = useState(false)
  const [assets, setAssets] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedTagsForFilter, setSelectedTagsForFilter] = useState([]);
 
  const { type, id } = props;

  const [criteria, setCriteria] = useState({
    type: "device",
    tags: selectedTagsForFilter,
    gateways: [id],
  });

  useEffect(() => {
    setIsLoading(true);
    const assetsPromise = inventoryAssetsStore.getAssets(
      { page: activePage, size: perPage },
      criteria
    );

    Promise.all([assetsPromise])
      .then((response) => {
        if (response[0].status === HttpStatus.OK) {
          setAssets(response[0].data.assets);
          setTotalItems(response[0].data.total_items);
          setTotalPages(response[0].data.total_pages);
          setErrorOnRequest(false);
          setIsLoading(false);
        } else {
          setAssets([]);
          setErrorOnRequest(true);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setAssets([]);
        setErrorOnRequest(true);
        setIsLoading(false);
      });
  }, [activePage, perPage, criteria]);

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  const handleOnChangeSelectedLabels = (items) => {
    setActivePage(1);
    setSelectedTagsForFilter(items.map((e) => e.code));
    setCriteria((oldCriteria) => {
      return { ...oldCriteria, ...{ tags: items.map((e) => e.code) } };
    });
  };

  const [selectedAsset, setSelectedAsset] = useState({})
  
  const closeInventoryDetails = () => {
    setSelectedAsset({});
  };

  const showAssetDetails = (index) => {
    const item = assets[index];
    const selected = {
      index,
      item,
      itemType: item.type
    };
    setSelectedAsset(selected);
  };

  return (
    <React.Fragment>
      <h5
        className="ui inverted top attached header"
        style={{ height: "44px", maxHeight: "44px" }}
      >
        INVENTORY {totalItems > 0 && <Label color="red">{totalItems}</Label>}
      </h5>
      {!_.isEmpty(selectedAsset) && (
        <InventoryDetailsModal
          selectedItem={selectedAsset}
          assets={assets}
          onClose={closeInventoryDetails}
        />
      )}
      <Segment attached stretched>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment attached>
                <GatewayCirclePackGraph
                  gatewayId={props.id}
                  onChangeSelectedLabels={handleOnChangeSelectedLabels}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={12}>
              <Segment attached style={{ height: "100%" }}>
                {errorOnRequest && (
                  <Message
                    error
                    header="Oops!"
                    content={"Something went wrong. Try again later."}
                    style={{ maxWidth: "100%" }}
                    className="animated fadeIn"
                  />
                )}
                {!errorOnRequest && isLoading && (
                  <LoaderComponent loadingMessage="Loading list..." />
                )}
                {!errorOnRequest && !isLoading && totalItems > 0 && (
                  <Table
                    striped
                    selectable
                    className="animated fadeIn"
                    basic="very"
                    compact="very"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell collapsing>
                          DEVICE ID
                        </Table.HeaderCell>
                        <Table.HeaderCell>ADDRESS</Table.HeaderCell>
                        <Table.HeaderCell>APPLICATION</Table.HeaderCell>
                        <Table.HeaderCell>
                          <Popup
                            trigger={
                              <span style={{ cursor: "pointer" }}>
                                FIRST ACTIVITY
                              </span>
                            }
                          >
                            This was the first time when the device was
                            detected in the network.
                          </Popup>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          <Popup
                            trigger={
                              <span style={{ cursor: "pointer" }}>
                                IMPORTANCE
                              </span>
                            }
                          >
                            The importance value indicates the user-defined
                            relevance of the device into the organization. Can
                            be set for each asset in the Inventory section.
                          </Popup>
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {assets &&
                        assets.map((item, index) => {
                          return (
                            <Table.Row
                              key={index}
                              style={{ cursor: "pointer" }}
                            >
                              <Table.Cell className="id-cell upper">
                                <ShowDeviceState state={item.connected} />
                                <AssetIdComponent
                                  type={item.type}
                                  id={item.id}
                                  hexId={item.hex_id}
                                />
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => showAssetDetails(index)}
                              >
                                {item.dev_addr}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => showAssetDetails(index)}
                              >
                                {item.app_name && (
                                  <TruncateMarkup>
                                    <div>{item.app_name}</div>
                                  </TruncateMarkup>
                                )}
                              </Table.Cell>
                              <Table.Cell collapsing>
                                {!_.isNull(item.first_activity) && (
                                  <Popup
                                    trigger={
                                      <span>
                                        {moment
                                          .unix(item.first_activity)
                                          .fromNow()}
                                      </span>
                                    }
                                    position="bottom left"
                                  >
                                    <Popup.Header>First seen</Popup.Header>
                                    <Popup.Content>
                                      {moment
                                        .unix(item.first_activity)
                                        .format(
                                          "dddd, MMMM Do, YYYY h:mm:ss A"
                                        )}
                                    </Popup.Content>
                                  </Popup>
                                )}
                              </Table.Cell>
                              <Table.Cell
                                onClick={() => showAssetDetails(index)}
                              >
                                <ImportanceLabel importance={item.importance} />
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                    </Table.Body>
                  </Table>
                )}
                {totalItems <= 0 && (
                  <EmptyComponent emptyMessage="There are no items to show." />
                )}
                {totalPages > 1 && (
                  <Grid className="segment centered">
                    <Pagination
                      size="mini"
                      activePage={activePage}
                      const
                      onPageChange={handlePaginationChange}
                      totalPages={totalPages}
                    />
                  </Grid>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default AssociatedAssetInventoryShow;
