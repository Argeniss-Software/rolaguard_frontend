import * as React from "react";
import { observer, inject } from "mobx-react";
import { Table, Pagination, Grid, Segment, Loader, Label, Icon, Checkbox } from "semantic-ui-react";
import ColorUtil from "../../util/colors.js";
import Pie from "../visualizations/Pie";
import Tag from "../utils/tags/tag.component";
import Bubble from "../visualizations/Bubble";
import InventoryDetailsModal from "./inventory.modal.component"

import "./inventory_review.component.css";
import LoaderComponent from "../utils/loader.component";
import EmptyComponent from "../utils/empty.component";
import InventoryIdComponent from "./inventory-id.component";
import { withRouter } from "react-router-dom";


@inject("generalDataStore", "usersStore", "inventoryAssetsStore")
@observer
class InventoryReviewComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tagsFeatureFlag: false,
      isLoading: true,
      isGraphsLoading: true,
      activePage: 1,
      pageSize: 20,
      pagesCount: null,
      assets: [],
      assetsCount: null,
			byVendorsViz: [],
      byGatewaysViz: [],
      byDataCollectorsViz: [],
      byTagsViz: [],
      selectedAsset: null,
      showFilters: true,
      criteria: {
        type: null,
        vendors: [],
        gateways: [],
        dataCollectors: [],
        tags: [],
      }
    };
  }

  componentWillMount() {
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

    {/* Remove following line when tags feature is available */}
    const tagsPromise = [];
    {/*
      This must be uncommented when tags feature is available
    const tagsPromise = this.props.inventoryAssetsStore.getTagsCount(crgiteria)
    */}

    
    Promise.all([assetsPromise, dataCollectorsPromise, gatewaysPromise, vendorsPromise, tagsPromise]).then(
      (responses) => {
        console.log(responses)


        {/* Filted data by count (delete entries with count=0, if any) */}
        const filterByCount = (data) => data.count !== 0;

        const assetsList = responses[0].data.assets;
        const assetsCount = responses[0].data.total_items;
        const pagesCount = responses[0].data.total_pages;
        const dataCollectors = responses[1].data.filter(filterByCount);
        const gateways = responses[2].data.filter(filterByCount);
        const vendors = responses[3].data.filter(filterByCount);

        {/*
          This must be uncommented when tags feature is available
        const tags = responses[4].data.filter(filterByCount);
        */}

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


        {/* set selected field from criteris */}

        dataCollectorsPieData.forEach((item) => item.selected = criteria.dataCollectors.includes(item.code));
        gatewaysPieData.forEach((item) => item.selected = criteria.gateways.includes(item.code));
        vendorsPieData.forEach((item) => item.selected = criteria.vendors.includes(item.code));

        assetsList.forEach((item)=> item.tags = [
          {name: "tag1", color: "#5d9cec", id: "idtag1"},
          {name: "tag2", color: "#fad732", id: "idtag2"},
          {name: "tag3", color: "#ff902b", id: "idtag3"},
          {name: "tag4", color: "#f05050", id: "idtag4"},
          {name: "tag5", color: "#1f77b4", id: "idtag5"},
        ])


        this.setState({
          assets: assetsList,
          assetsCount: assetsCount,
          pagesCount: pagesCount,
          byDataCollectorsViz: dataCollectorsPieData,
          byGatewaysViz: gatewaysPieData,
          byVendorsViz: vendorsPieData,
          isLoading: false,
          isGraphsLoading: false
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
      isLast: this.state.activePage === this.state.pagesCount && index === this.state.assets.length-1
    }

    this.setState({ selectedAsset });
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

    
    this.showAssetDetails(newIndex);
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

  clearFilters() {
    
    this.setState({ criteria:{
        types: [],
        vendors: [],
        gateways: [],
        dataCollectors: [],
        tags: [],
      },
      isGraphsLoading: true,
      isLoading: true,
    });

    this.loadAssetsAndCounts();
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, isLoading: true });
    const { criteria, pageSize, selectedAlert } = this.state;

    const assetsPromise = this.props.inventoryAssetsStore.getAssets({page: activePage, size: pageSize}, criteria);
    
    Promise.all([assetsPromise]).then(
      (response) => {
        this.setState({
          assets: response[0].data.assets,
          assetsCount: response[0].data.total_items,
          pagesCount: response[0].data.total_pages,
          isLoading: false
        });
      }
    );
  }

  showIcon(type) {
    if (type && type.toLowerCase().trim() === 'device' && type.toLowerCase() !== 'unknown') {
      return <i className="fas fa-microchip" />
    }
    if (type && type.toLowerCase().trim() === 'gateway' && type.toLowerCase() !== 'unknown') {
      return <i className="fas fa-broadcast-tower" />
    }
    if (type && type.toLowerCase().trim() === 'unknown') {
      return <i className="fas fa-question"/>;
    }

    return(
      <div>
          <i style={{verticalAlign: "middle"}} className="fas fa-broadcast-tower fa-xs" />/<i style= {{verticalAlign: "middle"}} className="fas fa-microchip fa-xs" />
      </div>
    );
  }

  toggleDeviceType(type){
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

  render(){
    let { showFilters, assets, assetsCount, byVendorsViz, byGatewaysViz, activePage, byDataCollectorsViz, tagsFeatureFlag, pagesCount, criteria, selectedAsset} = this.state;

    const filter = (item) => item.selected;
    const filteredVendors = byVendorsViz.filter(filter);
    const filteredGateways = byGatewaysViz.filter(filter);
    const filteredDataCollectors = byDataCollectorsViz.filter(filter);


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
                    <h5 className="visualization-title">BY GATEWAY</h5>
                    <Loader active={this.state.isGraphsLoading === true} />
                    <Pie 
                      isLoading={this.state.isGraphsLoading}
                      data={byGatewaysViz}
                      type={'byGatewaysViz'}
                      handler={this.handleItemSelected}
                    />
                  </div>
                </Grid.Column>

                <Grid.Column className="data-container-box pl0 pr0" mobile={16} tablet={8} computer={4}>
                  <div className="box-data">
                    <h5 className="visualization-title">BY MESSAGE COLLECTOR</h5>
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
                  {tagsFeatureFlag &&  
                    <div className="box-data"> 
                      <h5 className="visualization-title">TAGS</h5>
                      <Loader active={this.state.isGraphsLoading === true} />
                      {/*<Bubble
                        isLoading={this.state.isGraphsLoading}
                        data={[]}
                        type={'tags'}
                      handler={this.handleItemSelected} />*/}
                    </div>
                  }
                  {!tagsFeatureFlag &&
                    <div className="box-data">
                      <h5 style={{color: "gray"}}>WORK IN PROGRESS</h5>
                      <i style={{color: "gray", aling: "middle"}} className="fas fa-exclamation fa-4x"></i>
                    </div>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>}
            <div className="view-body">
              <div className="table-container">
                <div className="table-container-box">
                  <Segment>
                      {showFilters && (
                        <div>
                          <label style={{fontWeight: 'bolder'}}>Filters: </label>
                            {filteredVendors.map( (item, index) => <Label as='a' key={'status'+index} className="text-uppercase" onClick={() => {this.handleItemSelected(byVendorsViz, item, 'byVendorsViz')}}>{item.label}<Icon name='delete'/></Label>)}
                            {filteredGateways.map( (item, index) => <Label as='a' key={'risk'+index} className="text-uppercase" onClick={() => {this.handleItemSelected(byGatewaysViz, item, 'byGatewaysViz')}}>{item.label}<Icon name='delete'/></Label>)}
                            {filteredDataCollectors.map( (item, index) => <Label as='a' key={'dc'+index} className="text-uppercase" onClick={() => {this.handleItemSelected(byDataCollectorsViz, item, 'byDataCollectorsViz')}}>{item.label}<Icon name='delete'/></Label>)}
                          <span className="range-select" onClick={() => this.clearFilters()}>Clear</span>
                        </div>
                        )}
                        {tagsFeatureFlag &&
                          <div style={{display: "flex", position: "relative", float: "right"}} className="range-select">
                            Assing tags
                          </div>
                        }
                        {!this.isLoading &&
                          <Table className="animated fadeIn" basic="very" compact="very">

                            <Table.Header>
                              <Table.Row>
                                {tagsFeatureFlag && <Table.HeaderCell collapsing><Checkbox/></Table.HeaderCell>}
                                <Table.HeaderCell style={{cursor: "pointer"}} onClick={() => this.toggleDeviceType(criteria.type)}collapsing>
                                    {this.showIcon(criteria.type)}
                                </Table.HeaderCell>
                                <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                                <Table.HeaderCell>NAME</Table.HeaderCell>
                                <Table.HeaderCell>VENDOR</Table.HeaderCell>
                                <Table.HeaderCell>APPLICATION</Table.HeaderCell>
                                <Table.HeaderCell>DATA COLLECTOR</Table.HeaderCell>
                                {tagsFeatureFlag && <Table.HeaderCell>TAGS</Table.HeaderCell>}
                              </Table.Row>
                            </Table.Header>

                            {assetsCount === 0 &&
                              <Table.Row>
                                <Table.Cell colSpan='100%'>
                                  <EmptyComponent emptyMessage="No assets found" />
                                </Table.Cell>
                              </Table.Row>
                            }

                            {assetsCount > 0 &&
                              <Table.Body>
                                {!this.state.isLoadingTable && assets && (
                                  assets.map((item, index) => {
                                    return (
                                      <Table.Row key={index}  style={{cursor: 'pointer'}}>
                                        {tagsFeatureFlag && <Table.Cell><Checkbox/></Table.Cell>}
                                        <Table.Cell style={{textAlign:"center"}} onClick={() => this.showAssetDetails(index)}>{this.showIcon(item.type)}</Table.Cell>
                                        <Table.Cell className="id-cell upper"  onClick={() => this.showAssetDetails(index)}>
                                          <InventoryIdComponent type={item.type} id={item.id}/>
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.name}</Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.vendor}</Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.application}</Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.data_collector}</Table.Cell>
                                        {tagsFeatureFlag &&
                                          <Table.Cell>
                                            {
                                              item.tags &&
                                              item.tags.map( (tag) => {return(<Tag text={tag} />)})
                                            }
                                          </Table.Cell>
                                        }
                                      </Table.Row>
                                    );
                                  })
                                )}
                              </Table.Body>
                            }

                          </Table>
                        }
                        
                        {this.state.isLoadingTable && (
                          <LoaderComponent loadingMessage="Loading inventory ..." style={{marginBottom: 20}}/>
                        )}
                        {!this.state.isLoadingTable && pagesCount > 1 && (
                          <Grid className="segment centered">
                            <Pagination className="" activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={pagesCount} />
                          </Grid>
                        )}
                  </Segment>

                  {selectedAsset && <InventoryDetailsModal loading={this.state.isLoading} item={selectedAsset} onClose={this.closeInventoryDetails} onNavigate={this.goToAlert}/>}
                </div>
              </div>
            </div>
					</div>
        </div>
    );
  }

}

export default InventoryReviewComponent;
