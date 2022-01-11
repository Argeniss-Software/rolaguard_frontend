import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Table,
  Pagination,
  Grid,
  Segment,
  Loader,
  Label,
  Icon,
  Checkbox,
  Popup,
  Button,
} from "semantic-ui-react";
import ColorUtil from "../../util/colors.js";
import Pie from "../visualizations/Pie";
import Tag from "../utils/tags/tag.component";
import CirclePack from "../visualizations/circle-pack/circle-pack.component";
import InventoryDetailsModal from "./inventory.modal.component";
import AssignTagsModal from "./inventory.assign-tags.modal.component";
import SetImportanceModal from "./inventory.set-importance.modal.component";

import "./inventory.component.css";
import LoaderComponent from "../utils/loader.component";
import EmptyComponent from "../utils/empty.component";
import AssetIdComponent from "../utils/asset-id.component";
import ShowDeviceIcon from "../utils/show-device-icon.component";
import ShowDeviceState from "../utils/show-device-state.component";
import ImportanceLabel from "../utils/importance-label.component";
import TruncateMarkup from "react-truncate-markup";
import moment from "moment";
import _ from "lodash";
import AssetShowSearchComponent from "../utils/asset/asset-show-search.component";
import { scaleDivergingPow } from "d3";
import * as HttpStatus from "http-status-codes";

@inject("generalDataStore", "usersStore", "inventoryAssetsStore", "tagsStore")
@observer
class InventoryReviewComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isGraphsLoading: true,
      activePage: 1,
      pageSize: 50,
      pagesCount: null,
      assets: [],
      assetsCount: null,
      byVendorsViz: [],
      byGatewaysViz: [],
      byDataCollectorsViz: [],
      byTagsViz: [],
      byImportancesViz: [],
      selectedAsset: null,
      showFilters: true,
      assignTags: false,
      setImportance: false,
      firstLoad: true,
      criteria: {
        type: null,
        vendors: [],
        gateways: [],
        dataCollectors: [],
        tags: [],
        importances: []
      },
      hidden: false,
      selectAll: false,
      anyElementSelected: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.loadAssetsAndCounts();
  }

  closeInventoryDetails = () => {
    this.setState({ selectedAsset: null });
  };

  loadAssetsAndCounts = () => {
    const { activePage, pageSize, criteria, hidden } = this.state;
    this.setState({ isLoading: true, isGraphsLoading: true });
    const assetsPromise = this.props.inventoryAssetsStore.getAssets(
      { page: activePage, size: pageSize },
      criteria,
      hidden,
    );
    const dataCollectorsPromise = this.props.inventoryAssetsStore.getDataCollectorsCount(
      criteria,
      hidden,
    );
    const vendorsPromise = this.props.inventoryAssetsStore.getVendorsCount(
      criteria,
      hidden,
    );
    const tagsPromise = this.props.inventoryAssetsStore.getTagsCount(
      criteria,
      hidden,);
    const importancesPromise = this.props.inventoryAssetsStore.getImportanceCount(
      criteria,
      hidden,
    );

    Promise.all([
      assetsPromise,
      dataCollectorsPromise,
      vendorsPromise,
      tagsPromise,
      importancesPromise,
    ]).then((responses) => {
      /* Filted data by count (delete entries with count=0, if any) */
      const filterByCount = (data) => data.count !== 0;

      const assetsList = responses[0].data.assets;
      const assetsCount = responses[0].data.total_items;
      const pagesCount = responses[0].data.total_pages;
      const dataCollectors = responses[1].data.filter(filterByCount);
      const vendors = responses[2].data.filter(filterByCount);
      const tags = responses[3].data.filter(filterByCount);
      const importances = responses[4].data.filter(filterByCount);

      /* Map API data into Piechart-ready data */
      const mapper = (item, index) => {
        return {
          code: item.id,
          label: item.name,
          value: item.count,
          percentage: item.count / assetsCount,
        };
      };

      const dataCollectorsPieData = dataCollectors.map(mapper);
      const vendorsPieData = vendors.map(mapper);

      const mapperTags = (item, index) => {
        return {
          code: item.id,
          label: item.name,
          value: item.count,
          color: item.color,
        };
      };
      const tagsCirclePackData = tags.map(mapperTags);

      const mapperImportances = (item, index) => {
        return {
          code: item.id,
          label: item.name,
          value: item.count,
          percentage: item.count / assetsCount,
        };
      };
      const importancesPieData = importances.map(mapperImportances);

      /* Apply colormaps */
      const applyColormap = (item, index) =>
        (item.color = ColorUtil.getByIndex(index));
      const applyColorMapImportances = (item, index) =>
        (item.color = ColorUtil.getByImportance(item.code));

      dataCollectorsPieData.forEach(applyColormap);
      vendorsPieData.forEach(applyColormap);
      importancesPieData.forEach(applyColorMapImportances);

      /* set selected field from criteria */

      dataCollectorsPieData.forEach(
        (item) => (item.selected = criteria.dataCollectors.includes(item.code))
      );
      vendorsPieData.forEach(
        (item) => (item.selected = criteria.vendors.includes(item.code))
      );
      tagsCirclePackData.forEach(
        (item) => (item.selected = criteria.tags.includes(item.code))
      );
      importancesPieData.forEach(
        (item) => (item.selected = criteria.importances.includes(item.code))
      );

      assetsList.forEach((item) => (item.selected = false));

      this.setState({
        assets: assetsList,
        assetsCount: assetsCount,
        pagesCount: pagesCount,
        byDataCollectorsViz: dataCollectorsPieData,
        byVendorsViz: vendorsPieData,
        byTagsViz: tagsCirclePackData,
        byImportancesViz: importancesPieData,
        isLoading: false,
        isGraphsLoading: false,
        selectAll: false,
        firstLoad: false,
      });
    });
  };

  showAssetDetails = (index) => {
    const item = this.state.assets[index];
    const selectedAsset = {
      index,
      item,
      itemType: item.type,
      isFirst: this.state.activePage === 1 && index === 0,
      isLast:
        this.state.activePage === this.state.pagesCount &&
        index === this.state.assets.length - 1,
    };

    this.setState({ selectedAsset: selectedAsset });
  };

  goToAlert = (direction) => {
    let newIndex = this.state.selectedAsset.index + direction;
    let newPage = null;

    if (
      this.state.selectedAsset.index === 0 &&
      direction < 0 &&
      this.state.activePage > 1
    ) {
      newIndex = this.state.pageSize - 1;
      newPage = this.state.activePage - 1;
    }

    if (
      this.state.selectedAsset.index === this.state.assets.length - 1 &&
      direction > 0 &&
      this.state.activePage < this.state.pagesCount
    ) {
      // When page changes, index must be set to 0
      newIndex = 0;
      newPage = this.state.activePage + 1;
    }

    if (newPage) {
      const nextAlert = () => {
        this.showAssetDetails(newIndex);
      };
      this.handlePaginationChangeWithCallBack(
        null,
        { activePage: newPage },
        nextAlert
      );
    } else {
      this.showAssetDetails(newIndex);
    }
  };

  handleItemSelected = (array, selectedItem, type) => {
    const foundItem = array.find((item) => item.code === selectedItem.code);
    foundItem.selected = !foundItem.selected;

    const { criteria } = this.state;

    switch (type) {
      case "byVendorsViz":
        criteria.vendors = array
          .filter((item) => item.selected)
          .map((item) => item.code);
        break;

      case "byGatewaysViz":
        criteria.gateways = array
          .filter((gw) => gw.selected)
          .map((gw) => gw.code);
        break;

      case "byDataCollectorsViz":
        criteria.dataCollectors = array
          .filter((dc) => dc.selected)
          .map((dc) => dc.code);
        break;

      case "byTagsViz":
        criteria.tags = array
          .filter((tag) => tag.selected)
          .map((tag) => tag.code);
        break;

      case "byImportancesViz":
        criteria.importances = array
          .filter((i) => i.selected)
          .map((i) => i.code);
        break;
      default:
        break;
    }

    this.setState(
      {
        [type]: array,
        activePage: 1,
        isLoading: true,
        isGraphsLoading: true,
        criteria,
      },
      this.loadAssetsAndCounts
    );
  };

  clearFilters = () => {
    this.setState(
      {
        criteria: {
          type: null,
          vendors: [],
          gateways: [],
          dataCollectors: [],
          tags: [],
          importances: [],
        },
        byVendorsViz: [],
        byGatewaysViz: [],
        byDataCollectorsViz: [],
        byTagsViz: [],
        activePage: 1,
        isGraphsLoading: true,
        isLoading: true,
      },
      this.loadAssetsAndCounts
    );
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState(
      { activePage, isLoading: true, isGraphsLoading: true },
      this.loadAssetsAndCounts
    );
  };

  handlePaginationChangeWithCallBack = (e, { activePage }, callback) => {
    this.setState(
      { activePage, isLoading: true, isGraphsLoading: true },
      () => {
        this.loadAssetsAndCounts();
        callback();
      }
    );
  };

  toggleDeviceType(type) {
    const { criteria } = this.state;

    /* null stands for both types */
    const order = [null, "gateway", "device"];

    const nextType = order[(order.indexOf(type) + 1) % order.length];
    criteria.type = nextType;

    const activePage = 1;
    this.setState(
      {
        criteria,
        activePage,
        isLoading: true,
        isGraphsLoading: true,
      },
      this.loadAssetsAndCounts
    );
  }

  toggleSelection(event) {
    const { selectAll, assets } = this.state;
    assets.forEach((asset) => {
      asset.selected = !selectAll;
      return asset;
    });

    this.setState({
      selectAll: !selectAll,
      assets: assets,
    });
  }

  toggleSingleSelect(item, index, event) {
    const { assets } = this.state;
    assets[index].selected = !assets[index].selected;

    this.setState({
      selectAll: assets.every((asset) => asset.selected),
      assets: assets,
    });
  }

  HideButton = (props) => {
    return (
      <Button
        onClick = { props.onClick}
        disabled = {!props.assets.some((asset) => asset.selected)}
      >
          HIDE
        </Button>
    );
  }

  ShowButton = (props) => {
    return (
      <Button
          onClick = { props.onClick}
          disabled = {!props.assets.some((asset) => asset.selected)}
        >
          SHOW
        </Button>
    );
  }

  SeeHiddenButton = (props) => {
    return(
      <Button
        onClick={ props.toggleHiding}
      >
        SEE HIDDEN ASSETS
      </Button>
    );
  }

  SeeVisibleButton = (props) => {
    return(
      <Button
        onClick={ props.toggleHiding }
      >
        SEE VISIBLE ASSETS
      </Button>
    );
  }

  ShowInventoryTable = (props) => {
    const { assetsCount, isLoading, assets, criteria, selectAll } = this.state;

    const tagsLeftEllipsis = (node) => {
      const tagsRendered = node.props.children;
      return (
        <Label circular color="grey" key="grey">
          + {node.props.dataCount - tagsRendered.length}
        </Label>
      );
    };

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
            <Table.HeaderCell collapsing>
              <Popup
                trigger={
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => this.toggleSelection(e)}
                  />
                }
              >
                This checkbox will select all items listed on this page, it will
                not select items on other pages.
              </Popup>
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: "pointer" }}
              onClick={() => this.toggleDeviceType(criteria.type)}
              collapsing
            >
              <ShowDeviceIcon type={criteria.type}></ShowDeviceIcon>
            </Table.HeaderCell>
            <Table.HeaderCell collapsing>ID</Table.HeaderCell>
            <Table.HeaderCell>NAME</Table.HeaderCell>

            <Table.HeaderCell>
              VENDOR
            </Table.HeaderCell>
            <Table.HeaderCell>
              APPLICATION
            </Table.HeaderCell>
            <Table.HeaderCell className="hide-old-computer">
              JOIN EUI/APP EUI
            </Table.HeaderCell>
            <Table.HeaderCell collapsing>
              <Popup
                trigger={
                  <span style={{ cursor: "pointer" }}>FIRST ACTIVITY</span>
                }
              >
                This was the first time when the device was detected in the
                network.
              </Popup>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Popup
                trigger={<span style={{ cursor: "pointer" }}>IMPORTANCE</span>}
              >
                The importance value indicates the user-defined relevance of the
                device into the organization. Can be set for each device in the
                Inventory section.
              </Popup>
            </Table.HeaderCell>
            <Table.HeaderCell className="hide-old-computer">
              DATA SOURCE
            </Table.HeaderCell>
            <Table.HeaderCell>LABELS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {assetsCount === 0 && (
          <Table.Row>
            <Table.Cell colSpan="100%">
              <EmptyComponent emptyMessage="No devices found" />
            </Table.Cell>
          </Table.Row>
        )}

        {!isLoading && assetsCount > 0 && (
          <Table.Body id="inventory-table">
            {assets &&
              assets.map((item, index) => {
                return (
                  <Table.Row key={index} style={{ cursor: "pointer" }}>
                    <Table.Cell>
                      <Checkbox
                        checked={item.selected}
                        onChange={(event) =>
                          this.toggleSingleSelect(item, index, event)
                        }
                      />
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => this.showAssetDetails(index)}
                      style={{ textAlign: "center" }}
                      collapsing
                    >
                      <ShowDeviceState state={item.connected} />
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
                    <Table.Cell className="id-cell upper">
                      <AssetIdComponent
                        type={item.type}
                        id={item.id}
                        hexId={item.hex_id}
                      />
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => this.showAssetDetails(index)}
                    >
                      <TruncateMarkup>
                        <span>{item.name}</span>
                      </TruncateMarkup>
                    </Table.Cell>

                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.vendor && (
                        <TruncateMarkup>
                          <span>{item.vendor}</span>
                        </TruncateMarkup>
                      )}
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.app_name && (
                        <TruncateMarkup>
                          <span>{item.app_name}</span>
                        </TruncateMarkup>
                      )}
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => this.showAssetDetails(index)}
                      className="hide-old-computer"
                    >
                      {item.join_eui && item.join_eui.toUpperCase()}
                    </Table.Cell>
                    <Table.Cell collapsing>
                      {!_.isNull(item.first_activity) && (
                        <Popup
                          trigger={
                            <span>
                              {moment.unix(item.first_activity).fromNow()}
                            </span>
                          }
                          position="bottom left"
                        >
                          <Popup.Header>First seen</Popup.Header>
                          <Popup.Content>
                            {moment
                              .unix(item.first_activity)
                              .format("dddd, MMMM Do, YYYY h:mm:ss A")}
                          </Popup.Content>
                        </Popup>
                      )}
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      <ImportanceLabel importance={item.importance} />
                    </Table.Cell>
                    <Table.Cell
                      className="hide-old-computer"
                      onClick={() => this.showAssetDetails(index)}
                      collapsing
                    >
                      {item.data_collector}
                    </Table.Cell>
                    <Table.Cell
                      onClick={() => this.showAssetDetails(index)}
                      style={{ maxWidth: "15%", width: "15%" }}
                    >
                      <TruncateMarkup
                        lines={1}
                        lineHeight="30px"
                        ellipsis={tagsLeftEllipsis}
                      >
                        <div
                          style={{ width: "150px" }}
                          dataCount={item.tags.length}
                        >
                          {item.tags.map((tag) => {
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
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        )}
      </Table>
    );
  };

  showActionsButtons() {
    const { assets, hidden } = this.state;
    return (
      <React.Fragment>
        {! hidden && 
        <this.HideButton 
          assets={assets}
          onClick = {() =>{
            this.props.inventoryAssetsStore.setHiding(true,assets.filter((item) => item.selected)).
            then((response) => {
              if(response.status === HttpStatus.OK) {
                this.loadAssetsAndCounts();
              }
            });
          }}
        />}
        { hidden && 
        <this.ShowButton 
          assets={assets}
          onClick = {() =>{
            this.props.inventoryAssetsStore.setHiding(false,assets.filter((item) => item.selected)).
            then((response) => {
              if(response.status === HttpStatus.OK) {
                this.loadAssetsAndCounts();
              }
            });
          }}
        />}
        <Button
          onClick={() => this.setState({ setImportance: true })}
          disabled={!assets.some((asset) => asset.selected)}
        >
          SET IMPORTANCE
        </Button>

        <Button
          onClick={() => this.setState({ assignTags: true })}
          disabled={!assets.some((asset) => asset.selected)}
        >
          ASSIGN LABELS
        </Button>
      </React.Fragment>
    );
  }

  showFilters() {
    const {
      byVendorsViz,
      byDataCollectorsViz,
      byTagsViz,
      byImportancesViz,
    } = this.state;
    const filter = (item) => item.selected;
    const filteredVendors = byVendorsViz.filter(filter);
    const filteredDataCollectors = byDataCollectorsViz.filter(filter);
    const filteredTags = byTagsViz.filter(filter);
    const filteredImportances = byImportancesViz.filter(filter);

    return (
      <React.Fragment>
        <label style={{ fontWeight: "bolder" }}>Filters: </label>
        {filteredVendors.map((item, index) => (
          <Label
            as="a"
            key={"status" + index}
            className="text-uppercase"
            onClick={() => {
              this.handleItemSelected(byVendorsViz, item, "byVendorsViz");
            }}
          >
            {item.label}
            <Icon name="delete" />
          </Label>
        ))}
        {filteredDataCollectors.map((item, index) => (
          <Label
            as="a"
            key={"dc" + index}
            className="text-uppercase"
            onClick={() => {
              this.handleItemSelected(
                byDataCollectorsViz,
                item,
                "byDataCollectorsViz"
              );
            }}
          >
            {item.label}
            <Icon name="delete" />
          </Label>
        ))}
        {filteredTags.map((item, index) => (
          <Label
            as="a"
            key={"tag" + index}
            className="text-uppercase"
            onClick={() => {
              this.handleItemSelected(byTagsViz, item, "byTagsViz");
            }}
          >
            LABEL: {item.label}
            <Icon name="delete" />
          </Label>
        ))}
        {filteredImportances.map((item, index) => (
          <Label
            as="a"
            key={"importance" + index}
            className="text-uppercase"
            onClick={() => {
              this.handleItemSelected(
                byImportancesViz,
                item,
                "byImportancesViz"
              );
            }}
          >
            IMPORTANCE: {item.label}
            <Icon name="delete" />
          </Label>
        ))}
        <span className="range-select" onClick={this.clearFilters}>
          Clear
        </span>
      </React.Fragment>
    );
  }

  render() {
    const {
      isLoading,
      showFilters,
      assets,
      byVendorsViz,
      activePage,
      byDataCollectorsViz,
      byTagsViz,
      byImportancesViz,
      pagesCount,
      selectedAsset,
      assignTags,
      setImportance,
      hidden,
    } = this.state;

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            <h1 className="mb0">INVENTORY</h1>
            <Grid.Column style={{ width: "50%" }}>
              <AssetShowSearchComponent />
            </Grid.Column>
            <div className="view-header-actions">
              {!showFilters && (
                <div onClick={() => this.setState({ showFilters: true })}>
                  <i className="fas fa-eye" />
                  <span>SHOW SEARCH AND CHARTS</span>
                </div>
              )}
              {showFilters && (
                <div
                  onClick={() => this.setState({ showFilters: false })}
                  style={{ color: "gray" }}
                >
                  <i className="fas fa-eye-slash" />
                  <span>HIDE SEARCH AND CHARTS</span>
                </div>
              )}
            </div>
          </div>

          {isLoading && (
            <LoaderComponent loadingMessage="Loading Inventory ..." />
          )}
          {!isLoading && (
            <React.Fragment>
              {showFilters && (
                <Segment>
                  <Grid className="animated fadeIn">
                    <Grid.Row
                      id="visualization-container"
                      className="data-container pl pr"
                    >
                      <Grid.Column
                        className="data-container-box pl0 pr0"
                        mobile={16}
                        tablet={8}
                        computer={4}
                      >
                        <div className="box-data">
                          <h5 className="visualization-title">BY VENDOR</h5>
                          <Loader
                            active={this.state.isGraphsLoading === true}
                          />
                          {!this.state.isGraphsLoading && (
                            <Pie
                              isLoading={this.state.isGraphsLoading}
                              data={byVendorsViz}
                              type={"byVendorsViz"}
                              handler={this.handleItemSelected}
                            />
                          )}
                        </div>
                      </Grid.Column>

                      <Grid.Column
                        className="data-container-box pl0 pr0"
                        mobile={16}
                        tablet={8}
                        computer={4}
                      >
                        <div className="box-data">
                          <h5 className="visualization-title">
                            BY DATA SOURCE
                          </h5>
                          <Loader
                            active={this.state.isGraphsLoading === true}
                          />
                          {!this.state.isGraphsLoading && (
                            <Pie
                              isLoading={this.state.isGraphsLoading}
                              data={byDataCollectorsViz}
                              type={"byDataCollectorsViz"}
                              handler={this.handleItemSelected}
                            />
                          )}
                        </div>
                      </Grid.Column>

                      <Grid.Column
                        className="data-container-box pl0 pr0"
                        mobile={16}
                        tablet={8}
                        computer={4}
                      >
                        <div className="box-data">
                          <h5 className="visualization-title">BY IMPORTANCE</h5>
                          <Loader
                            active={this.state.isGraphsLoading === true}
                          />
                          {!this.state.isGraphsLoading && (
                            <Pie
                              isLoading={this.state.isGraphsLoading}
                              data={byImportancesViz}
                              type={"byImportancesViz"}
                              handler={this.handleItemSelected}
                            />
                          )}
                        </div>
                      </Grid.Column>

                      <Grid.Column
                        className="data-container-box pl0 pr0"
                        mobile={16}
                        tablet={8}
                        computer={4}
                      >
                        <div className="box-data">
                          <h5 className="visualization-title">LABELS</h5>
                          <Loader
                            active={this.state.isGraphsLoading === true}
                          />
                          {!this.state.isGraphsLoading && (
                            <div style={{ width: "100%", height: "260px" }}>
                              <CirclePack
                                isLoading={this.state.isGraphsLoading}
                                data={byTagsViz}
                                type={"byTagsViz"}
                                handler={this.handleItemSelected}
                              />
                            </div>
                          )}
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              )}
              <div className="view-body">
                <div className="table-container">
                  <div className="table-container-box">
                    <Segment
                      style={{marginBottom:20}}>
                      <div className="header-table-container">
                        <div
                          className={
                            showFilters ? "box-data filters-container" : "hide "
                          }
                        >
                          {this.showFilters()}
                        </div>
                        <div className="actions-buttons-container">
                          {this.showActionsButtons()}
                        </div>
                      </div>
                      {/* Show inventory table */}
                      {!this.isLoading && <this.ShowInventoryTable />}

                      {isLoading && (
                        <LoaderComponent
                          loadingMessage="Loading inventory ..."
                          style={{ marginBottom: 20, height: "320px" }}
                        />
                      )}
                      {!isLoading && pagesCount > 1 && (
                        <Grid className="segment centered">
                          <Pagination
                            className=""
                            activePage={activePage}
                            onPageChange={this.handlePaginationChange}
                            totalPages={pagesCount}
                          />
                        </Grid>
                      )}
                    </Segment>
                    <div className="actions-buttons-container">
                      { !hidden && <this.SeeHiddenButton 
                        toggleHiding = {
                          () => this.setState({hidden: true},this.loadAssetsAndCounts)
                      }/>}
                      { hidden && <this.SeeVisibleButton toggleHiding = {
                          () => this.setState({hidden: false},this.loadAssetsAndCounts)
                      }/> }
                    </div>
                    
                    {selectedAsset && (
                      <InventoryDetailsModal
                        loading={this.state.isLoading}
                        selectedItem={selectedAsset}
                        assets={this.state.assets}
                        onClose={this.closeInventoryDetails}
                        onNavigate={this.goToAlert}
                      />
                    )}
                    {assignTags && (
                      <AssignTagsModal
                        open={assignTags}
                        assets={assets}
                        onClose={() => this.setState({ assignTags: false })}
                        onSuccess={() => {
                          this.loadAssetsAndCounts();
                          this.setState({ assignTags: false });
                        }}
                      />
                    )}
                    {setImportance && (
                      <SetImportanceModal
                        open={setImportance}
                        assets={assets}
                        onClose={() => this.setState({ setImportance: false })}
                        onSuccess={() => {
                          this.loadAssetsAndCounts();
                          this.setState({ setImportance: false });
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default InventoryReviewComponent;
