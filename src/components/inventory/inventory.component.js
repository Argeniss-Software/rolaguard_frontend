import * as React from "react";
import { observer, inject } from "mobx-react";
import { Table, Pagination, Grid, Segment, Loader, Label, Icon, Checkbox, Popup, Button } from "semantic-ui-react";
import ColorUtil from "../../util/colors.js";
import Pie from "../visualizations/Pie";
import BarChart from "../visualizations/Bar";
import Tag from "../utils/tags/tag.component";
//import Bubble from "../visualizations/Bubble";
import InventoryDetailsModal from "./inventory.modal.component";
import AssignTagsModal from "./inventory.assign-tags.modal.component";

import "./inventory.component.css";
import LoaderComponent from "../utils/loader.component";
import EmptyComponent from "../utils/empty.component";
import AssetIdComponent from "../utils/asset-id.component";
import ShowDeviceIcon from "../utils/show-device-icon.component";

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
      selectedAsset: null,
      showFilters: true,
      assignTags: false,
      criteria: {
        type: null,
        vendors: [],
        gateways: [],
        dataCollectors: [],
        tags: [],
      },
      selectAll: false,
      anyElementSelected: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.loadAssetsAndCounts();
  }

  closeInventoryDetails = () => {
    this.setState({ selectedAsset: null });
  }

  loadAssetsAndCounts = () => {
    const { activePage, pageSize, criteria } = this.state;
    const assetsPromise = this.props.inventoryAssetsStore.getAssets({page: activePage, size: pageSize}, criteria);
    const dataCollectorsPromise = this.props.inventoryAssetsStore.getDataCollectorsCount(criteria);
    const gatewaysPromise = this.props.inventoryAssetsStore.getGatewaysCount(criteria);
    const vendorsPromise = this.props.inventoryAssetsStore.getVendorsCount(criteria);
    const tagsPromise = this.props.inventoryAssetsStore.getTagsCount(criteria);

    
    Promise.all([assetsPromise, dataCollectorsPromise, gatewaysPromise, vendorsPromise, tagsPromise]).then(
      (responses) => {

        {/* Filted data by count (delete entries with count=0, if any) */}
        const filterByCount = (data) => data.count !== 0;

        const assetsList = responses[0].data.assets;
        const assetsCount = responses[0].data.total_items;
        const pagesCount = responses[0].data.total_pages;
        const dataCollectors = responses[1].data.filter(filterByCount);
        const gateways = responses[2].data.filter(filterByCount);
        const vendors = responses[3].data.filter(filterByCount);
        const tags = responses[4].data.filter(filterByCount);

        {/* Map API data into Piechart-ready data */}
        const mapper = (item, index) => {return {code:item.id, label:item.name, value:item.count, percentage: item.count/assetsCount}};

        const dataCollectorsPieData = dataCollectors.map(mapper);
        const gatewaysPieData = gateways.map(mapper);
        const vendorsPieData = vendors.map(mapper);

        {/* Apply colormaps */}
        const applyColormap = (item, index) => item.color = ColorUtil.getByIndex(index)      

        dataCollectorsPieData.forEach(applyColormap);
        gatewaysPieData.forEach(applyColormap);
        vendorsPieData.forEach(applyColormap);


        {/* set selected field from criteria */}

        dataCollectorsPieData.forEach((item) => item.selected = criteria.dataCollectors.includes(item.code));
        gatewaysPieData.forEach((item) => item.selected = criteria.gateways.includes(item.code));
        vendorsPieData.forEach((item) => item.selected = criteria.vendors.includes(item.code));

        assetsList.forEach((item) => item.selected = false);
        
        this.setState({
          assets: assetsList,
          assetsCount: assetsCount,
          pagesCount: pagesCount,
          byDataCollectorsViz: dataCollectorsPieData,
          byGatewaysViz: gatewaysPieData,
          byVendorsViz: vendorsPieData,
          byTagsViz: tags,
          isLoading: false,
          isGraphsLoading: false,
          selectAll: false,
        });
     }
    );
  }

  showAssetDetails = (index) => {
    const item = this.state.assets[index];
    const selectedAsset = {
      index,
      item,
      itemType: item.type,
      isFirst: this.state.activePage === 1 && index === 0,
      isLast: this.state.activePage === this.state.pagesCount && index === this.state.assets.length-1,
    }

    this.setState({ selectedAsset: selectedAsset});
    return selectedAsset;
  }

  goToAlert = (direction) => {

    let newIndex = this.state.selectedAsset.index + direction;

    if (this.state.selectedAsset.index === 0 && direction < 0) {
      if (this.state.activePage > 1) {
        this.handlePaginationChange(null, {activePage: this.state.activePage-1})
        newIndex = this.state.pageSize-1;
      }
    }

    if (this.state.selectedAsset.index === this.state.assets.length-1 && direction > 0) {
      if (this.state.activePage < this.state.pagesCount ) {
        this.handlePaginationChange(null, {activePage: this.state.activePage+1})
        // When page changes, index must be set to 0
        newIndex = 0;
      }
    }
    return this.showAssetDetails(newIndex);
  }

  handleItemSelected = (array, selectedItem, type) => {
    const foundItem = array.find(item => item.label === selectedItem.label);
    foundItem.selected = !foundItem.selected;

    const { criteria, pageSize } = this.state;

    switch(type) {
      case 'byVendorsViz':
        criteria.vendors = array.filter(item => item.selected).map(item => item.code);
        break;

      case 'byGatewaysViz':
        criteria.gateways = array.filter(gw => gw.selected).map(gw => gw.code);
        break;
      
      case 'byDataCollectorsViz':
        criteria.dataCollectors = array.filter(dc => dc.selected).map(dc => dc.code);
        break;
    }

    this.setState({[type]: array, activePage: 1, isLoading: true, isGraphsLoading: true, criteria});

    this.loadAssetsAndCounts();
  }

  clearFilters = () => {
    
    this.setState({
      criteria: {
        type: null,
        vendors: [],
        gateways: [],
        dataCollectors: [],
        tags: [],
      },
      byVendorsViz: [],
      byGatewaysViz: [],
      byDataCollectorsViz: [],
      byTagsViz: [],
      activePage: 1,
      isGraphsLoading: true,
      isLoading: true,
    });

    this.loadAssetsAndCounts();
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, isLoading: true });
    const { criteria, pageSize, selectedAlert } = this.state;

    const assetsPromise =  this.props.inventoryAssetsStore.getAssets({page: activePage, size: pageSize}, criteria);

    Promise.all([assetsPromise]).then(
      (response) => {
        this.setState({
          selectAll: false,
          assets: response[0].data.assets,
          assetsCount: response[0].data.total_items,
          pagesCount: response[0].data.total_pages,
          isLoading: false
        });
      });

    return assetsPromise;
  }

  toggleDeviceType(type) {
    const { criteria, pageSize } = this.state;

    /* null stands for both types */
    const order = [null, "gateway", "device"];

    const nextType = order[(order.indexOf(type) + 1) % order.length];
    criteria.type = nextType;

    const activePage = 1;
    this.setState({
      criteria,
      activePage,
      isLoading: true,
      isGraphsLoading: true,
    });

    this.loadAssetsAndCounts();
  }

  toggleSelection(event){
    const { selectAll, assets } = this.state;
    assets.forEach((asset) => {asset.selected = !selectAll; return asset});

    this.setState({
      selectAll: !selectAll,
      assets: assets,
    });
  }

  toggleSingleSelect(item, index, event){
    const { selectAll, assets } = this.state;
    assets[index].selected = !assets[index].selected;

    this.setState({
      selectAll: assets.every((asset) => asset.selected),
      assets: assets,
    });
  }

  showInventoryTable(){
    const {assetsCount, isLoadingTable, assets, criteria, selectAll} = this.state;
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
            <Table.HeaderCell>VENDOR</Table.HeaderCell>
            <Table.HeaderCell>APPLICATION</Table.HeaderCell>
            <Table.HeaderCell>DATA SOURCE</Table.HeaderCell>
            <Table.HeaderCell>TAGS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {assetsCount === 0 && (
          <Table.Row>
            <Table.Cell colSpan="100%">
              <EmptyComponent emptyMessage="No assets found" />
            </Table.Cell>
          </Table.Row>
        )}

        {assetsCount > 0 && (
          <Table.Body id="inventory-table">
            {!isLoadingTable &&
              assets &&
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
                      style={{ textAlign: "center" }}
                      onClick={() => this.showAssetDetails(index)}
                      >                      
                      <ShowDeviceIcon type={(item.type && !["gateway", "device"].includes(item.type.toLowerCase().trim())) ? "unknown" : item.type}></ShowDeviceIcon>
                    </Table.Cell>
                    <Table.Cell
                      className="id-cell upper"
                      onClick={() => this.showAssetDetails(index)}
                    >
                      <AssetIdComponent type={item.type} id={item.hex_id} />
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.name}
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.vendor}
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.application}
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.data_collector}
                    </Table.Cell>
                    <Table.Cell onClick={() => this.showAssetDetails(index)}>
                      {item.tags.map((tag) => {
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
                  </Table.Row>
                );
              })}
          </Table.Body>
        )}
      </Table>
    );
  }

  showActionsButtons() {
    const { assets } = this.state;
    return(
      <React.Fragment>
        <Button 
          onClick={() => alert("Work in progress")}
          disabled={!assets.some((asset) => asset.selected)}
        >
          SET IMPORTANCE
        </Button>

        <Button
          onClick={() => this.setState({assignTags: true})}
          disabled={!assets.some((asset) => asset.selected)}
        >
          ASSIGN TAGS
        </Button>
      </React.Fragment>
    );
  }

  showFilters() {
    const { byVendorsViz, byGatewaysViz, byDataCollectorsViz } = this.state;

    const filter = (item) => item.selected;
    const filteredVendors = byVendorsViz.filter(filter);
    const filteredGateways = byGatewaysViz.filter(filter);
    const filteredDataCollectors = byDataCollectorsViz.filter(filter);

    return(
      <React.Fragment>
        <label style={{fontWeight: 'bolder'}}>Filters: </label>
          {filteredVendors.map( (item, index) => <Label as='a' key={'status'+index} className="text-uppercase" onClick={() => {this.handleItemSelected(byVendorsViz, item, 'byVendorsViz')}}>{item.label}<Icon name='delete'/></Label>)}
          {filteredGateways.map( (item, index) => <Label as='a' key={'risk'+index} className="text-uppercase" onClick={() => {this.handleItemSelected(byGatewaysViz, item, 'byGatewaysViz')}}>{item.label}<Icon name='delete'/></Label>)}
          {filteredDataCollectors.map( (item, index) => <Label as='a' key={'dc'+index} className="text-uppercase" onClick={() => {this.handleItemSelected(byDataCollectorsViz, item, 'byDataCollectorsViz')}}>{item.label}<Icon name='delete'/></Label>)}
        <span className="range-select" onClick={this.clearFilters}>Clear</span>
      </React.Fragment>
    );
  }

  render(){
    const { 
      showFilters,
      assets,
      assetsCount,
      byVendorsViz,
      byGatewaysViz,
      activePage,
      byDataCollectorsViz,
      pagesCount,
      criteria,
      selectedAsset,
      selectAll,
      assignTags,
    } = this.state;

    return (
      <div className="app-body-container-view">
      <div className="animated fadeIn animation-view">
        <div className="view-header">
          <h1 className="mb0">INVENTORY</h1>
          <div className="view-header-actions">
            {!showFilters &&
              <div onClick={() => this.setState({showFilters: true})}>
                <i className="fas fa-eye" />
                <span>SHOW SEARCH AND CHARTS</span>
              </div>
            }
            {showFilters &&
              <div onClick={() => this.setState({showFilters: false})} style={{color: 'gray'}}>
                <i className="fas fa-eye-slash" />
                <span>HIDE SEARCH AND CHARTS</span>
              </div>
            }
          </div>
        </div>
        {showFilters && 
          <Segment>
            <Grid className="animated fadeIn">

              <Grid.Row id="visualization-container" className="data-container pl pr">
                <Grid.Column className="data-container-box pl0 pr0" mobile={16} tablet={8} computer={4}>
                  <div className="box-data">
                    <h5 className="visualization-title">BY VENDOR</h5>
                    <Loader active={this.state.isGraphsLoading === true} />
                    <Pie 
                      isLoading={this.state.isGraphsLoading}
                      data={byVendorsViz}
                      type={'byVendorsViz'}
                      handler={this.handleItemSelected}
                    />
                  </div>
                </Grid.Column>

                <Grid.Column className="data-container-box pl0 pr0" mobile={16} tablet={8} computer={4}>
                  <div className="box-data">
                    <h5 className="visualization-title">BY DATA SOURCE</h5>
                    <Loader active={this.state.isGraphsLoading === true} />
                    <Pie
                      isLoading={this.state.isGraphsLoading}
                      data={byDataCollectorsViz}
                      type={'byDataCollectorsViz'}
                      handler={this.handleItemSelected}
                    />
                  </div>
                </Grid.Column>

                <Grid.Column className="data-container-box pl0 pr0" mobile={16} tablet={8} computer={4}>
               {/* <div className="box-data">
                         <BarChart
                          isLoading={this.state.isGraphsLoading}
                          data={this.state.byTagsViz.map((tag) => tag.)}
                          domain={this.state.visualizationXDomain}
                          barsCount={this.state.barsCount}
                          range={this.state.range}
                        /> */}
                        {/* <Loader active={this.state.alertsCountLoading === true} />
                        <div className="box-data-legend">
                          <i className="fas fa-exclamation-circle" />
                          <div>
                            <h3>ALERTS</h3>
                            {
                              this.state.alertsCountLoading === true ? 
                              <div className="ui active inline loader"></div> :
                              <h2>{alertsCount}</h2>
                            }
                            </div>
                        </div>
                      </div> */}

                  <div className="box-data">
                      <h5 style={{color: "gray"}}>WORK IN PROGRESS</h5>
                      <i style={{color: "gray", aling: "middle"}} className="fas fa-exclamation fa-4x"></i>
                    </div>
                </Grid.Column>

                <Grid.Column className="data-container-box pl0 pr0" mobile={16} tablet={8} computer={4}>
                  {/*tagsFeatureFlag &&  
                    <div className="box-data"> 
                      <h5 className="visualization-title">TAGS</h5>
                      <Loader active={this.state.isGraphsLoading === true} />
                      <Bubble
                        isLoading={this.state.isGraphsLoading}
                        data={[]}
                        type={'tags'}
                      handler={this.handleItemSelected} />
                    </div>
                  */}
                  <div className="box-data">
                    <h5 style={{color: "gray"}}>WORK IN PROGRESS</h5>
                    <i style={{color: "gray", aling: "middle"}} className="fas fa-exclamation fa-4x"></i>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>}
            <div className="view-body">
              <div className="table-container">
                <div className="table-container-box">
                  <Segment>
                    <div className="header-table-container">
                      <div className={showFilters? "box-data filters-container" : "hide "}>
                        {this.showFilters()}
                      </div>
                      <div className="actions-buttons-container">
                        {this.showActionsButtons()}
                      </div>
                    </div>
                    {/* Show inventory table */}
                    {!this.isLoading && this.showInventoryTable()}

                    {this.state.isLoadingTable && (
                      <LoaderComponent loadingMessage="Loading inventory ..." style={{marginBottom: 20, height:"320px"}}/>
                    )}
                    {!this.state.isLoadingTable && pagesCount > 1 && (
                      <Grid className="segment centered">
                        <Pagination className="" activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={pagesCount} />
                      </Grid>
                    )}
                  </Segment>

                  {selectedAsset && <InventoryDetailsModal loading={this.state.isLoading} selectedItem={selectedAsset} assets={this.state.assets} onClose={this.closeInventoryDetails} onNavigate={this.goToAlert}/>}
                  {assignTags && <AssignTagsModal open={assignTags} assets={assets} onClose={() => this.setState({assignTags: false})} onSuccess={() => {this.loadAssetsAndCounts(); this.setState({assignTags: false});}}/>}
                </div>
              </div>
            </div>
					</div>
        </div>
    );
  }

}

export default InventoryReviewComponent;
