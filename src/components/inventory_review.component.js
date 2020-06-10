import * as React from "react";
import { observer, inject } from "mobx-react";
import { Table, Pagination, Grid, Segment, Button, Loader, Divider, Label, Icon, Popup, Message, GridColumn } from "semantic-ui-react";
import Pie from "./visualizations/Pie";
import Tag from "./utils/tag.component";
import Bubble from "./visualizations/Bubble";

import "./alarm_review.component.css";
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
      isLoading: true,
      isGraphsLoading: false,
      isStatusLoading: false,
      activePage: 1,
      pageSize: 20,
      assets: [],
      assetsCount: 1,
			vendors: [],
      gateways: [],
      dataCollectors: [],
      count: null,
      orderBy: ['created_at', 'DESC'],
      showFilters: true,
      criteria: {
        type: [],
        gateway: [],
        dataCollector: [],
        
      }
    };
  }

  componentWillMount() {
    this.loadAlertsAndCounts();
  }

  loadAlertsAndCounts = () => {
    const assetsPromise = this.props.inventoryAssetsStore.getMockupAssets();
    const dataCollectorsPromise = this.props.inventoryAssetsStore.getMockupDataCollectors();
    const gatewaysPromise = this.props.inventoryAssetsStore.getMockupGateways();
    const vendorsPromise = this.props.inventoryAssetsStore.getMockupVendors();
    
    Promise.all([assetsPromise, dataCollectorsPromise, gatewaysPromise, vendorsPromise]).then(
      (responses) => {

        this.setState({
          assets: assetsPromise,
          dataCollectors: dataCollectorsPromise,
          gateways: gatewaysPromise,
          vendors: vendorsPromise
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
      case 'statuses':
        const theOtherItem = array.find(item => item.label !== selectedItem.label);
        if(foundItem.label === 'RESOLVED') {  
          if(foundItem.selected) {
            theOtherItem.selected = false;
            criteria.resolved = true;
          } else {
            criteria.resolved = null;
          }
        } else {
          if(foundItem.selected) {
            theOtherItem.selected = false;
            criteria.resolved = false;
          } else {
            criteria.resolved = null;
          }
        }        
        break;

      case 'types':
        criteria.type = array.filter(item => item.selected).map(item => item.code);
        break;

      case 'risks':
        criteria.risk = array.filter(risk => risk.selected).map(risk => risk.label);
        break;
      
      case 'dataCollectors':
        criteria.dataCollector = array.filter(dc => dc.selected).map(dc => dc.id);
    }

    this.setState({[type]: array, activePage: 1, isLoading: true, criteria});

    const alertsPromise = this.props.alertStore.query({page: 0, size: pageSize, order: this.state.orderBy}, criteria);
    const countPromise = this.props.alertStore.count('TOTAL', criteria);

    Promise.all([alertsPromise, countPromise]).then(
      responses => {
        const alerts = responses[0].data;
        const alertsCount = responses[1].data.count;
        this.setState({
          alertsCount,
          alerts,
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
    let { showFilters, devices, assets, assetsCount, vendors, gateways, pageSize, activePage, dataCollectors } = this.state;
    let totalPages = Math.ceil(assetsCount/pageSize);
    const spacing = 15;
    const position = [51.505, -0.09]
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
                      data={vendors}
                      type={'vendors'}
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
                      data={gateways}
                      type={'gateways'}
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
                      data={dataCollectors}
                      type={'dataCollectors'}
                      handler={this.handleItemSelected}
                    />
                  </div>
                </Grid.Column> 

                <Grid.Column className="data-container-box pl0 pr0" mobile={16} tablet={8} computer={4}>
                  <div className="box-data">
                    <h5 className="visualization-title">TAGS</h5>
                    <Loader active={this.state.isGraphsLoading === true} />
                    <Bubble
                      isLoading={this.state.isGraphsLoading}
                      data={[]}
                      type={'tags'}
                      handler={this.handleItemSelected} />
                  </div>
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
                          <span className="range-select" onClick={() => this.updateRange('DAY')}>Clear</span>
                        </div>)}

                        {!this.isLoading &&
                          <Table className="animated fadeIn" basic="very" compact="very">

                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                                <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                                <Table.HeaderCell>NAME</Table.HeaderCell>
                                <Table.HeaderCell>VENDOR</Table.HeaderCell>
                                <Table.HeaderCell>TAGS</Table.HeaderCell>
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
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{this.showIcon(item.type)}</Table.Cell>
                                        <Table.Cell className="id-cell upper"  onClick={() => this.showAssetDetails(index)}>
                                          <InventoryIdComponent type={item.type} id={item.id}/>
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.name}</Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.vendor}</Table.Cell>
                                        <Table.Cell>
                                          {
                                            item.tags &&
                                            item.tags.map( (tag) => {return(<Tag text={tag} />)})
                                          }
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.showAssetDetails(index)}>{item.dataCollector}</Table.Cell>
                                      </Table.Row>
                                    );
                                  })
                                )}
                              </Table.Body>
                            }

                          </Table>
                        }
                        
                        {this.state.isLoadingTable && (
                          <LoaderComponent loadingMessage="Loading quarantine ..." style={{marginBottom: 20}}/>
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
