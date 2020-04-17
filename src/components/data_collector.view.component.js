import * as React from "react";
import { observer, inject } from "mobx-react";
import { Divider, Header, Grid } from "semantic-ui-react";
import LoaderComponent from "./utils/loader.component";
import moment from "moment";
import Validation from "../util/validation";

@inject("dataCollectorStore", "usersStore")
@observer
class DataCollectorViewComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      ...props,
      dataCollector: null,
      isAdmin: false
    };
  }

  componentWillMount() {
    const dataCollectorId = this.props.match.params.data_collector_id;
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);
    this.props.dataCollectorStore.getDataCollectorById(dataCollectorId).then(
      res => {
        this.setState({dataCollector: res.data, isLoading: false, isAdmin});
      }
    )
  }

  render() {
    const { history } = this.props;
    const { dataCollector, isAdmin } = this.state;
    let topics = null;
    if (dataCollector) {
      topics = dataCollector.topics.reduce((topic, previous) => (previous + ', ' + topic), '')
      topics = topics.substring(0, topics.length - 2);
    }
    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            {/* HEADER TITLE */}
            <h1>VIEW MESSAGE COLLECTOR</h1>

            {/* HEADER ACTIONS */}
            <div className="view-header-actions">
  
              <div
                onClick={() => {
                  history.push("/dashboard/data_collectors/" + dataCollector.id + "/log");
                }}>
                <i className="fas fa-align-justify" />
                <span>VIEW LOGS</span>
              </div>

              {isAdmin && <div
                onClick={() => {
                  history.push("/dashboard/data_collectors/" + dataCollector.id + "/edit");
                }}>
                <i className="fas fa-edit" />
                <span>EDIT</span>
              </div>}
            </div>
          </div>

          {/* VIEW BODY */}
          <div className="view-body">
            {this.state.isLoading && (
              <LoaderComponent loadingMessage="Loading message collector..." />
            )}
            {!this.state.isLoading && (
              <div>
                <Header as='h2' >Details</Header>
                <Divider style={{marginTop: 0}}></Divider>
                <Grid columns={2}>
                  <Grid.Column>
                  <h4>Name</h4>
                  <p>{dataCollector.name}</p>
                  <h4>Type</h4>
                  <p>{dataCollector.type ? dataCollector.type.name : ''}</p>
                  </Grid.Column>
                  <Grid.Column>
                    <h4>Description</h4>
                    <p>{dataCollector.description && dataCollector.description}</p>
                    <p>{!dataCollector.description && 'No description'}</p>
                    <h4>Policy</h4>
                    <p>{dataCollector.policy_name ? dataCollector.policy_name : ''}</p>
                  </Grid.Column>
                </Grid>
                <Header as='h2' >Status</Header>
                <Divider style={{marginTop: 0}}></Divider>
                <Grid columns={2} >
                    <Grid.Column>
                      <h4>Status</h4>
                      <span style={{height: 10, width: 10, backgroundColor: dataCollector.status === 'CONNECTED' ? '#01dd01' : dataCollector.status === 'DISCONNECTED' ? 'red' : '#c0c0c0', 
                          borderRadius: '50%', marginRight: 8, display: 'inline-block'}}></span>
                      {dataCollector.status.toLowerCase()}
                    </Grid.Column>
                    <Grid.Column>
                      <h4>Last message</h4>
                      <p>{dataCollector.lastMessage ? moment(dataCollector.lastMessage).fromNow() : 'No messages in last 4 hours'}</p>
                    </Grid.Column>
                    <a onClick={() => {
                      history.push("/dashboard/data_collectors/" + dataCollector.id + "/log");
                    }} style={{cursor: 'pointer', textDecoration: 'underline' }}>View logs</a>
                </Grid>
                <Header as='h2' >Connection</Header>
                <Divider style={{marginTop: 0}} ></Divider>

                { dataCollector.type.type !== 'ttn_collector' && <Grid columns={2} style={{marginBottom: 10}}>
                    <Grid.Column>
                      <h4>IP address</h4>
                      <p>{dataCollector.ip}</p>
                      {dataCollector.user && <h4>User</h4>}
                      {dataCollector.user && <p>{dataCollector.user}</p>}
                      <h4>Mode SSL</h4>
                      <p>{dataCollector.ssl ? 'Yes': 'No'}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <h4>Port</h4>
                      <p>{dataCollector.port}</p>
                      <h4>Topics</h4>
                      <p>{topics.length>0 && topics}
                      {topics.length===0 && 'No topics'}</p>
                    </Grid.Column>
                  </Grid> }
                  { dataCollector.type.type === 'ttn_collector' && <Grid columns={2} style={{marginBottom: 10}}>
                    <Grid.Column>
                      <h4>Gateway ID</h4>
                      <p>{dataCollector.gateway_id}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <h4>User</h4>
                      <p>{dataCollector.user}</p>
                    </Grid.Column>
                  </Grid> }

              </div>)}
            </div>
          </div>
      </div>
    );
  }
}

export default DataCollectorViewComponent;
