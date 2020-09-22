import React, { useState, useEffect, useContext} from "react";
import {
  Table,
  Label,
  Grid,
  Pagination,
  Segment,
  // Icon,
  Popup,
} from "semantic-ui-react";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";
import AlertUtil from "../../../util/alert-util";
import AssetIdComponent from "../asset-id.component";
// import DateFilterBar from "./date-filter-bar.component";
import ImportanceLabel from "../importance-label.component";
import TruncateMarkup from "react-truncate-markup";
import ShowDeviceState from "../show-device-state.component"
import { MobXProviderContext } from "mobx-react";
import GatewayCirclePackGraph from "./gateway-circle-pack-graph.component";

const AssociatedAssetInventoryShow = (props) => {
  const { inventoryAssetsStore } = useContext(MobXProviderContext);
  const colorsMap = AlertUtil.getColorsMap();

  const [selectedAsset, setSelectedAsset] = useState({
    asset: {},
    asset_type: {},
  });

  const [assets, setAssets] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [selectedTagsForFilter, setSelectedTagsForFilter] = useState([]);
  /* 
  const [orderBy, setOrderBy] = useState(["created_at", "DESC"]);
  const [dateFilter, setDateFilter] = useState({
    from: null,
    to: null,
  }); 
  */
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
    
    Promise.all([assetsPromise]).then((response) => {
      setAssets(response[0].data.assets);
      setTotalItems(response[0].data.total_items);
      setTotalPages(response[0].data.total_pages);
      setIsLoading(false);
    });
  }, [activePage, perPage, criteria]);

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  const showAlertDetails = (data) => {
    setSelectedAsset({
      asset: data,
      asset_type: data.type,
    });
  };

  /*const toggleSort = (field) => {
    setOrderBy([field, orderBy[1] === "ASC" ? "DESC" : "ASC"]);
  };*/

  const closeAlertDetails = () => {
    setSelectedAsset({
      asset: {},
      asset_type: {},
    });
  };

  /*const handleDateFilterChange = (date) => {
    setDateFilter((prevDate) => {
      return { ...prevDate, ...date };
    });
  };*/

  /*const toggleShowFilter = () => {
    setShowFilters((actualShowFilter) => {
      return !actualShowFilter;
    });
  };*/

  const showAssetDetails = (index) => {
    const item = assets[index];
    const selectedAsset = {
      index,
      item,
      itemType: item.type,
      isFirst: activePage === 1 && index === 0,
      isLast: activePage === totalPages && index === assets.length - 1,
    };
    setSelectedAsset({ selectedAsset: selectedAsset });
  };
  
  const handleOnChangeSelectedLabels = (items) => {
    setSelectedTagsForFilter(items.map((e) => e.code));
    setCriteria((oldCriteria) => {
      return { ...oldCriteria, ...{ tags: items.map((e) => e.code) } };
    })
  }

  return (
    <React.Fragment>
      <h5
        className="ui inverted top attached header"
        style={{ height: "44px", maxHeight: "44px" }}
      >
        INVENTORY {totalItems > 0 && <Label color="red">{totalItems}</Label>}
      </h5>

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
                {totalItems > 0 && (
                  <Table
                    striped
                    selectable
                    className="animated fadeIn"
                    basic="very"
                    compact="very"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                        <Table.HeaderCell>ADDRESS</Table.HeaderCell>
                        <Table.HeaderCell>APPLICATION</Table.HeaderCell>

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