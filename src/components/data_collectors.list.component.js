import * as React from "react";
import { observer, inject } from "mobx-react";
import { Popup, Table, Pagination, Grid, Message } from "semantic-ui-react";
import moment from "moment";
import LoaderComponent from "./utils/loader.component";
import DeleteDataCollectorModal from "./delete.data_collector.modal.component";
import ChangeStatusDataCollectorModal from "./change_status.data_collector.modal.component";
import Validation from "../util/validation";
import {subscribeToUpdatedDataCollectorEvents, unsubscribeFromUpdatedDataCollectorEvents} from '../util/web-socket';

@inject("dataCollectorStore", "usersStore")
@observer
class DataCollectorListComponent extends React.Component {

  subscriber = null;

  state = {
    isLoading: true,
    isLoadingActivity: true,
    dataCollectors: [],
    activities: [],
    totalItems: null,
    totalPages: null,
    pagination: {
      page: 1,
      size: 20
    }
  };

  loadPage() {
    const { pagination } = this.state;
    this.setState({isLoading: true});
    this.props.dataCollectorStore.query(pagination).then(
      ({ data, headers }) => {
        const dataCollectors = data['data_collectors'];
        const totalItems = headers['total-items'];
        const totalPages = headers['total-pages'];
        this.setState({isLoading: false, totalItems, totalPages, dataCollectors});
      }
    ).catch(
      err => {
        this.setState({isLoading: false, hasError: true });
        console.error('err', err);
      }
    );
  }

  loadActivities() {
    this.setState({isLoadingActivity: true});
    this.props.dataCollectorStore.getDataCollectorsActivity().then( res => {
      const activities = res.data;
      this.setState({isLoadingActivity: false, activities});                
    }).catch(
      err => {
        this.setState({isLoading: false, hasError: true });
        console.error('err', err);
      }
    );
  }

  reset = () => {
    let { pagination } = this.state;
    pagination.page = 1;
    this.setState({ pagination });
    this.loadPage();
    this.loadActivities();
  }

  componentDidMount() {
    this.loadPage();
    this.loadActivities();
    this.subscriber = subscribeToUpdatedDataCollectorEvents(
      event => {
        const id = event['id'];
        const {dataCollectors, activities} = this.state;
        const act = activities.find(act => act.dataCollectorId === id);
        event['lastMessage'] = act ? act.maxDate : null;
        const index = dataCollectors.findIndex(dc => dc.id === id);
        if(index > -1) {
          dataCollectors[index] = event;
          this.setState({dataCollectors});
        }

      }
    );
  }

  componentWillUnmount() {
    unsubscribeFromUpdatedDataCollectorEvents(this.subscriber);
  }

  handlePaginationChange = (e, { activePage }) => {    
    let { pagination } = this.state;
    pagination.page = activePage;
    this.setState({ pagination });
    this.loadPage();
  }

  sortDataCollector(dataCollectors) {
    const dataCollectorsOrdered = dataCollectors.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStatus = a.status.toLowerCase();
      const bStatus = b.status.toLowerCase();
      if (aStatus === bStatus) {
        return (aName > bName) ? 1 : (bName > aName) ? - 1 : 0;
     }
     return aStatus > bStatus ? 1 : -1;
    });
    return dataCollectorsOrdered;
  }

  render() {
    const { history } = this.props;
    const { dataCollectors, activities, isLoadingActivity, isLoading, totalPages, pagination, hasError } = this.state;
    const { page } = pagination;
    const dataCollectorsOrdered = this.sortDataCollector(dataCollectors);
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

    if(!isLoading && !isLoadingActivity) {
      dataCollectors.forEach( dc => {
        const act = activities.find(act => act.dataCollectorId === dc.id);
        dc['lastMessage'] = act ? act.maxDate : null;
      });
    
    }

    let headers = [
      {
        name: "NAME",
        visible: true
      },
      {
        name: "TYPE",
        visible: true
      },
      {
        name: "STATUS",
        visible: true
      },
      {
        name: "LAST MESSAGE",
        visible: true
      },
      {
        name: "ACTIONS",
        visible: true
      }
    ];

    let headerToShow = headers.map((header, index) => {
      if (header.visible) {
        return (
          <Table.HeaderCell key={"header-" + index}>
            {header.name}
          </Table.HeaderCell>
        );
      } else {
        return ""
      }
    });
    
    let dataCollectorList = dataCollectorsOrdered.map((dataCollector, index) => {

      return (
        <Table.Row key={dataCollector.name + index}>
          <Table.Cell>{dataCollector.name}</Table.Cell>
          <Table.Cell>{dataCollector.type ? dataCollector.type.name : ''}</Table.Cell>
          <Table.Cell>
            <span style={{height: 10, width: 10, backgroundColor: dataCollector.status === 'CONNECTED' ? '#01dd01' : dataCollector.status === 'DISCONNECTED' ? 'red' : '#c0c0c0', 
              borderRadius: '50%', marginRight: 8, display: 'inline-block'}}></span>
            {dataCollector.status.toLowerCase()}
          </Table.Cell>
          {isLoadingActivity && <Table.Cell><LoaderComponent></LoaderComponent></Table.Cell>}
          {!isLoadingActivity && <Table.Cell>{dataCollector.lastMessage ? moment(dataCollector.lastMessage).fromNow() : 'No messages in last 4 hours'}</Table.Cell>}
          <Table.Cell className="wd-xl">
            <div className="td-actions">
            {/* VIEW BUTTON */}
            <Popup
                trigger={
                  <button
                    onClick={() => {
                      history.push(
                        "/dashboard/data_collectors/" + dataCollector.id + "/view",
                        { dataCollector: dataCollector }
                      );
                    }}>
                    <i className="fas fa-eye" />
                  </button>
                }
                content="View"
              />

              <Popup
                trigger={
                  <button
                    onClick={() => {
                      history.push(
                        "/dashboard/data_collectors/" + dataCollector.id + "/log",
                        { dataCollector: dataCollector }
                      );
                    }}>
                    <i className="fas fa-align-justify" />
                  </button>
                }
                content="View logs"
              />

              {/* DISABLE/ENABLE BUTTON */}
              {isAdmin && <ChangeStatusDataCollectorModal dataCollector={dataCollector} onConfirm={this.reset}/>}

              {/* EDIT BUTTON */}
              {isAdmin && <Popup
                trigger={
                  <button
                    onClick={() => history.push(`/dashboard/data_collectors/${dataCollector.id}/edit`)}>
                    <i className="fas fa-edit" />
                  </button>
                }
                content="Edit"
              /> }

              {/* DELETE BUTTON */}
              {isAdmin && <DeleteDataCollectorModal dataCollector={dataCollector} callback={this.reset} /> }
            </div>
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            {/* HEADER TITLE */}
            <h1>DATA SOURCES</h1>

            {/* HEADER ACTIONS */}
            <div className="view-header-actions">
              {isAdmin && <div onClick={() => history.push("/dashboard/data_collectors/new")}>
                <i className="fas fa-plus" />
                <span>NEW DATA SOURCE</span>
              </div>}
            </div>
          </div>

          {/* VIEW BODY */}
          <div className="view-body">
          {!this.state.isLoading && dataCollectorList.length === 0 && (
              <h3 style={{textAlign: 'center'}}>No registered data sources.</h3>
            )}

            {isLoading && (
              <LoaderComponent loadingMessage="Loading data sources..." />
            )}
            {!this.state.isLoading && dataCollectorList.length > 0 && (
              <Table className="animated fadeIn" basic="very" compact="very">
                <Table.Header>
                  <Table.Row>{headerToShow}</Table.Row>
                </Table.Header>
                <Table.Body>{dataCollectorList}</Table.Body>
              </Table>
            )}
            { hasError && 
                <Message error header='Oops!' content={'Something went wrong. Try again later.'} style={{maxWidth: '100%'}}/>
              }
              <Grid className="segment centered">
                { totalPages > 1 && !isLoading &&
                  <Pagination className="" activePage={page} onPageChange={this.handlePaginationChange} totalPages={totalPages} />
                }
              </Grid>

          </div>
        </div>
      </div>
    );
  }
}

export default DataCollectorListComponent;
