import * as React from "react";
import { observer, inject } from "mobx-react";
import { Table, Pagination, Grid, Segment, Button, Loader, Divider, Label, Icon, Popup, Message, GridColumn, Checkbox } from "semantic-ui-react";
import ColorUtil from "../util/colors.js";
import Pie from "./visualizations/Pie";
import Tag from "./utils/tag.component";
import Bubble from "./visualizations/Bubble";

import "./inventory_review.component.css";
import LoaderComponent from "./utils/loader.component";
import EmptyComponent from "./utils/empty.component";
import InventoryIdComponent from "./utils/inventory-id.component";
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
      assets: [],
      assetsCount: null,
			byVendorsViz: [],
      byGatewaysViz: [],
      byDataCollectorsViz: [],
      byTagsViz: [],
      selectedAsset: null,
      showFilters: true,
      criteria: {
        types: [],
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

        const assetsList = responses[0].data.devices;
        {/*const assetsCount = responses[0].data.total_items;*/}
        const assetsCount = 776
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

        this.setState({
          assets: assetsList,
          assetsCount: assetsCount,
          byDataCollectorsViz: dataCollectorsPieData,
          byGatewaysViz: gatewaysPieData,
          byVendorsViz: vendorsPieData,
          isLoading: false,
          isGraphsLoading: false
        });
     }
    );
  }



  showAssetDetails(index){
  }

  handleItemSelected = (array, selectedItem, type) => {
    const foundItem = array.find(item => item.label === selectedItem.label);
    foundItem.selected = !foundItem.selected;

    const { criteria, pageSize } = this.state;

    switch(type) {
      case 'vendor':
        criteria.vendors = array.filter(item => item.selected).map(item => item.code);
        break;

      case 'gateway':
        criteria.gateways = array.filter(gw => gw.selected).map(gw => gw.code);
        break;
      
      case 'dataCollector':
        criteria.dataCollectors = array.filter(dc => dc.selected).map(dc => dc.code);
        break;
    }

    this.setState({[type]: array, activePage: 1, isLoading: true, isGraphsLoading: true, criteria});

    this.loadAssetsAndCounts()
  }

  clearFilters() {
    const { criteria } = this.state;

    this.state.byVendorsViz.forEach(entry => entry.selected = false) 
    this.state.byGatewaysViz.forEach(entry => entry.selected = false)
    this.state.byDataCollectorsViz.forEach(entry => entry.selected = false)
    this.state.byTagsViz.forEach(entry => entry.selected = false)

    criteria.types = [];
    criteria.vendors = [];
    criteria.dataCollectors = [];
    criteria.tags = [];

    this.setState({ criteria });
    this.loadAssetsAndCounts();
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, isLoading: true });
    const { criteria, pageSize, selectedAlert } = this.state;

    const assetsPromise = this.props.inventoryAssetsStore.getAssets({page: activePage, size: pageSize}, criteria);
    
    Promise.all([assetsPromise]).then(
      (responses) => {
        this.setState({
          assets: responses[0].data.devices,
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
    
    return <i className="fas fa-question"/>;
  }

  render(){
    let { showFilters, assets, assetsCount, byVendorsViz, byGatewaysViz, pageSize, activePage, byDataCollectorsViz, tagsFeatureFlag } = this.state;
    let totalPages = Math.ceil(assetsCount/pageSize);
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
                      type={'vendor'}
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
                      type={'gateway'}
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
                      type={'dataCollector'}
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
                          <span className="range-select" onClick={() => this.clearFilters()}>Clear</span>
                        </div>
                        )}
                        {tagsFeatureFlag &&
                          <div style={{display: "flex", position: "relative", float: "right"}} className="range-select" onClick={this.clearFilters}>
                            Assing tags
                          </div>
                        }
                        {!this.isLoading &&
                          <Table className="animated fadeIn" basic="very" compact="very">

                            <Table.Header>
                              <Table.Row>
                                {tagsFeatureFlag && <Table.HeaderCell collapsing><Checkbox/></Table.HeaderCell>}
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                                <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                                <Table.HeaderCell>NAME</Table.HeaderCell>
                                <Table.HeaderCell>VENDOR</Table.HeaderCell>
                                {tagsFeatureFlag && <Table.HeaderCell>TAGS</Table.HeaderCell>}
                                <Table.HeaderCell>APPLICATION</Table.HeaderCell>
                                <Table.HeaderCell>DATA COLLECTOR</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>

                            {assetsCount == 0 &&
                              <Table.Row>
                                <Table.Cell colSpan='100%'>
                                  <EmptyComponent emptyMessage="No assets found" />
                                </Table.Cell>
                              </Table.Row>
                            }

                            {assetsCount > 0 &&
                              <Table.Body>
                                {!this.state.isLoadingTable && (
                                  assets.map((item, index) => {
                                    return (
                                      <Table.Row key={index}  style={{cursor: 'pointer'}}>
                                        {tagsFeatureFlag && <Table.Cell><Checkbox/></Table.Cell>}
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{this.showIcon(item.type)}</Table.Cell>
                                        <Table.Cell className="id-cell upper"  onClick={() => this.showAssetDetails(index)}>
                                          <InventoryIdComponent type={item.type} id={item.id}/>
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.name}</Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.vendor}</Table.Cell>
                                        {tagsFeatureFlag &&
                                          <Table.Cell>
                                            {
                                              item.tags &&
                                              item.tags.map( (tag) => {return(<Tag text={tag} />)})
                                            }
                                          </Table.Cell>
                                        }
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.application}</Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.data_collector}</Table.Cell>
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
                        {!this.state.isLoadingTable && totalPages > 1 && (
                          <Grid className="segment centered">
                            <Pagination className="" activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={totalPages} />
                          </Grid>
                        )}
                  </Segment>
                </div>
              </div>
            </div>
					</div>
        </div>
    );
  }

}

export default InventoryReviewComponent;
