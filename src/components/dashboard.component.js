import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Table,
  Loader,
  Segment,
  Button,
  Dropdown,
  Popup,
  Grid,
  Header,
} from "semantic-ui-react";
import {
  subscribeToNewAlertEvents,
  unsubscribeFromNewAlertEvents,
} from "../util/web-socket";
import { Link } from "react-router-dom";
import moment from "moment";

import BarChart from "./visualizations/Bar";

import "./dashboard.component.css";
import microchipSvg from "../img/microchip.svg";
import LoaderComponent from "./utils/loader.component";
import DetailsAlertModal from "../components/details.alert.modal.component";
import DataCollectorTooltip from "./dashboard/data.collector.tooltip";
import AlertUtil from "../util/alert-util";
import AlertListComponent from "./alert.list.component";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";
import _ from "lodash";
import DataCollectorSelector from "./utils/data-collector-selector.component"
@inject(
  "generalDataStore",
  "usersStore",
  "deviceStore",
  "alarmStore",
  "alertStore",
  "dataCollectorStore"
)
@observer
class DashboardComponent extends React.Component {
  subscriber = null;

  constructor(props) {
    super(props);

    this.state = {
      dataCollectors: [],
      selectedDataCollectors: [],
      numberOfPreviewAlerts: 5,
      microchipUrl: microchipSvg,
      alarms: null,
      alertsCount: null,
      topAlerts: null,
      topAlertsLoading: true,
      isLoading: true,
      ...props,
      organization_name: "",
      isRefreshing: false,
      devices_count: 0,
      range: "DAY",
      barsCount: 0,
      alertsCountArray: null,
      selectedAlert: null,
      visualizationXDomain: {
        from: null,
        to: null,
      },
      lastUpdated: Date.now(),
      override: null,
    };
  }

  updateRange(range, silent) {
    let barsCount = 0;
    let groupBy = "DAY";
    let from, to, visualizationDomainFrom, visualizationDomainTo;

    this.setState({ lastUpdated: Date.now() });

    if (range === "DAY") {
      groupBy = "HOUR";
      barsCount = 26;
      from = moment().subtract(1, "days").utc().format();
      to = moment().utc().format();

      visualizationDomainFrom = moment()
        .subtract(1, "days")
        .subtract(1, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      visualizationDomainTo = moment()
        .add(1, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
    } else if (range === "WEEK") {
      barsCount = 9;
      from = moment().subtract(7, "days").utc().format("YYYY-MM-DD");
      to = moment().add(1, "day").utc().format("YYYY-MM-DD");

      visualizationDomainFrom = moment()
        .subtract(8, "days")
        .format("YYYY-MM-DD");
      visualizationDomainTo = moment()
        .add(1, "days")
        .utc()
        .format("YYYY-MM-DD");
    } else if (range === "MONTH") {
      barsCount = 33;
      from = moment().subtract(1, "month").utc().format("YYYY-MM-DD");
      to = moment().add(1, "day").utc().format("YYYY-MM-DD");

      visualizationDomainFrom = moment()
        .subtract(1, "month")
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      visualizationDomainTo = moment()
        .add(1, "days")
        .utc()
        .format("YYYY-MM-DD");
    }

    const dataCollectors = this.state.selectedDataCollectors;

    this.setState({ newDevicesLoading: true && !silent });
    this.props.deviceStore
      .getNewDevicesCount({ groupBy, from, to, dataCollectors })
      .then((response) =>
        this.setState({
          newDevicesLoading: false,
        })
      );

    this.setState({ packetsLoading: true && !silent });
    this.props.deviceStore
      .getPacketsCount({ groupBy, from, to, dataCollectors })
      .then((response) =>
        this.setState({
          packetsLoading: false,
        })
      );

    this.setState({ quarantineCountLoading: true && !silent });
    this.props.deviceStore
      .getQuarantineDeviceCount({ groupBy, from, to, dataCollectors })
      .then((response) =>
        this.setState({
          quarantineCountLoading: false,
        })
      );

    this.setState({ quarantineDeviceCountLoading: true && !silent });
    this.props.deviceStore
      .getQuarantineDeviceCount({ from, to, dataCollectors })
      .then((response) =>
        this.setState({
          quarantineDeviceCountLoading: false,
        })
      );

    this.getAlerts(groupBy, from, to, dataCollectors, silent);

    this.setState({
      range: range,
      barsCount: barsCount,
      isLoading: false,
      alertsCountArray: [],
      visualizationXDomain: {
        from: new Date(visualizationDomainFrom),
        to: new Date(visualizationDomainTo),
      },
    });
  }

  componentDidMount() {
    this.getDataCollectors();
    this.updateRange("DAY");
    this.getTopAlerts();

    this.override = css`
      display: inline-block;
      margin-right: 5px;
    `;

    this.subscriber = subscribeToNewAlertEvents(() => {
      const { lastUpdated, range } = this.state;

      if (Date.now() - lastUpdated > 60 * 1000) {
        this.getTopAlerts(true);
        this.updateRange(range, true);
      }
    });
  }

  componentWillUnmount() {
    unsubscribeFromNewAlertEvents(this.subscriber);
  }

  handleAlertResolution = () => {
    this.getTopAlerts();
  };

  handleDataCollectorSelection = (params) => {
    const {
      totalCollectors,
      activeCollectors,
      dataCollectorsOptions,
    } = params;
    
    const dataCollectors = dataCollectorsOptions;

     this.setState({
       totalCollectors,
       activeCollectors,
       dataCollectorsLoading: false,
       isLoading: false,
       dataCollectors,
     });
    const { range } = this.state;

    this.setState({ selectedDataCollectors: params.selected }, () => {
      this.updateRange(range, true);
      this.getTopAlerts();
    });
  };

  getDataCollectors() {
    this.setState({
      dataCollectorsLoading: true,
    });
  }

  getTopAlerts(silent) {
    this.setState({
      topAlertsLoading: true && !silent,
    });

    const from = moment().subtract(7, "days").utc().format("YYYY-MM-DD");
    const topalertsPromise = this.props.alertStore.query(
      { page: 0, size: this.state.numberOfPreviewAlerts },
      {
        resolved: false,
        from,
        dataCollector: this.state.selectedDataCollectors,
      }
    );
    const alertsTypesPromise = this.props.alarmStore.getAlertsType();

    Promise.all([topalertsPromise, alertsTypesPromise]).then((response) => {
      const alarmsTypesMap = {};
      response[1].forEach((alarmType) => {
        alarmsTypesMap[alarmType.code] = alarmType;
      });

      this.setState({
        topAlertsLoading: false,
        topAlerts: response[0].data,
        alarmsTypesMap,
      });
    });
  }

  getAlerts(groupBy, from, to, dataCollectors, silent) {
    this.setState({
      alertsCountLoading: true && !silent,
    });

    this.props.alarmStore
      .getAlertsCount({ groupBy, from, to, dataCollectors })
      .then((response) => {
        const alertsCountArray = [];

        const dateAttributeName = groupBy === "HOUR" ? "hour" : "date";
        const colorsMap = AlertUtil.colorsMap;

        const filteredResponse = response.filter(
          (alertCount) => alertCount.risk != null
        );

        filteredResponse.forEach((alarmCount, i) => {
          alertsCountArray.push({
            xValue: new Date(alarmCount[dateAttributeName]),
            yValue: alarmCount.count,
            color: colorsMap[alarmCount.risk],
          });
        });

        const alertsCount = filteredResponse
          .map((item) => item.count)
          .reduce((value, partialTotal) => value + partialTotal, 0);

        this.setState({
          alertsCountLoading: false,
          alertsCountArray: alertsCountArray,
          isLoading: false,
          alertsCount: alertsCount,
        });
      });
  }

  goToAlert = (direction) => {
    if (this.state.selectedAlert.index === 0 && direction < 0) {
      return;
    }

    if (
      this.state.selectedAlert.index === this.state.topAlerts.length - 1 &&
      direction > 0
    ) {
      return;
    }

    const newIndex = this.state.selectedAlert.index + direction;
    this.showAlertDetails(newIndex);
  };

  showAlertDetails = (index) => {
    const alert = this.state.topAlerts[index];

    const selectedAlert = {
      index,
      alert,
      alert_type: this.state.alarmsTypesMap[alert.type],
      isFirst: index === 0,
      isLast: index === this.state.topAlerts.length - 1,
    };

    this.setState({ selectedAlert });
  };

  closeAlertDetails = () => {
    this.setState({ selectedAlert: null });
  };

  render() {
    let organization_name = this.props.usersStore.currentUser.organization_name;

    let {
      activeCollectors,
      totalCollectors,
      alertsCount,
      selectedAlert,
      dataCollectors,
      dataCollectorsLoading,
    } = this.state;
    if (organization_name) {
      organization_name = organization_name.toUpperCase();
    }

    if (alertsCount && alertsCount >= 1000 && alertsCount < 1000000) {
      alertsCount = (alertsCount / 1000).toFixed(1) + "K";
    } else if (alertsCount && alertsCount >= 1000000) {
      alertsCount = (alertsCount / 1000000).toFixed(1) + "M";
    }

    let packetsCount = this.props.deviceStore.packetsCount;
    if (packetsCount && packetsCount >= 1000 && packetsCount < 1000000) {
      packetsCount = (packetsCount / 1000).toFixed(1) + "K";
    } else if (packetsCount && packetsCount >= 1000000) {
      packetsCount = (packetsCount / 1000000).toFixed(1) + "M";
    }

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view dashboard">
          <div className="view-header">
            {/* HEADER TITLE */}
            <h1>DASHBOARD</h1>
          </div>

          {/* VIEW BODY */}
          <div className="view-body">
            {this.state.isLoading && (
              <LoaderComponent loadingMessage="Loading dashboard..." />
            )}
            {!this.state.isLoading && (
              <div>
                <Segment>
                  <Grid
                    className="animated fadeIn"
                    stretched
                    verticalAlign="middle"
                    centered
                  >
                    <Grid.Row>
                      <Grid.Column floated="left" width={11}>
                        <h3>
                          <i className="fas fa-sitemap" /> | DATA SOURCES{" "}
                          {dataCollectorsLoading === true ? (
                            <span className="ui active inline loader" />
                          ) : (
                            <DataCollectorTooltip
                              dataCollectors={dataCollectors}
                              activeCollectors={activeCollectors}
                              totalCollectors={totalCollectors}
                            />
                          )}
                        </h3>
                      </Grid.Column>

                      <Grid.Column
                        width={5}
                        floated="right"
                        className="pull-right aligned"
                        stretched
                        verticalAlign="middle"
                        centered
                      >
                        {activeCollectors > 0 && (
                          <React.Fragment>
                            <div>
                              <BounceLoader
                                css={this.override}
                                size={16}
                                color="#01dd01"
                                loading={true}
                              />
                              <span>
                                <Header
                                  as="h6"
                                  color={"green"}
                                  size="small"
                                  style={{ display: "inline" }}
                                >
                                  ANALYZING DATA...
                                </Header>
                              </span>
                            </div>
                          </React.Fragment>
                        )}
                        {activeCollectors <= 0 && (
                          <span>
                            There isn't any data source configured yet.
                            <Link to="/dashboard/data_collectors">
                              Try to add one
                            </Link>{" "}
                            for getting data
                          </span>
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "0.9rem",
                      marginBottom: "0.9rem",
                    }}
                  >
                    <DataCollectorSelector
                      onChange={this.handleDataCollectorSelection}
                    />
                  </div>
                  <div
                    className="text-right"
                    style={{ marginTop: "0.9rem", marginBottom: "0.9rem" }}
                  >
                    <Button.Group basic size="mini">
                      <Button
                        active={this.state.range === "MONTH"}
                        onClick={() => {
                          this.updateRange("MONTH");
                        }}
                      >
                        Last month
                      </Button>
                      <Button
                        active={this.state.range === "WEEK"}
                        onClick={() => {
                          this.updateRange("WEEK");
                        }}
                      >
                        Last week
                      </Button>
                      <Button
                        active={this.state.range === "DAY"}
                        onClick={() => {
                          this.updateRange("DAY");
                        }}
                      >
                        Last day
                      </Button>
                    </Button.Group>
                  </div>
                  <div id="visualizations" className="data-container ui grid">
                    <div className="animated fadeIn data-container-box four wide computer eight wide tablet sixteen wide mobile column">
                      <div className="box-data">
                        <BarChart
                          isLoading={this.state.quarantineCountLoading}
                          data={
                            this.props.deviceStore.quarantineDeviceCountGrouped
                          }
                          domain={this.state.visualizationXDomain}
                          barsCount={this.state.barsCount}
                          range={this.state.range}
                        />
                        <Loader
                          active={this.state.quarantineCountLoading === true}
                        />
                        <div className="box-data-legend">
                          <i className="fas fa-exclamation-triangle" />
                          <div>
                            <h3>CURRENT ISSUES</h3>
                            {this.state.quarantineDeviceCountLoading ===
                            true ? (
                              <div className="ui active inline loader"></div>
                            ) : (
                              <h2>
                                {this.props.deviceStore.quarantineDeviceCount}
                              </h2>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="animated fadeIn data-container-box four wide computer eight wide tablet sixteen wide mobile column">
                      <div className="box-data">
                        <BarChart
                          isLoading={this.state.alertsCountLoading}
                          data={this.state.alertsCountArray}
                          domain={this.state.visualizationXDomain}
                          barsCount={this.state.barsCount}
                          range={this.state.range}
                        />
                        <Loader
                          active={this.state.alertsCountLoading === true}
                        />
                        <div className="box-data-legend">
                          <i className="fas fa-exclamation-circle" />
                          <div>
                            <h3>ALERTS</h3>
                            {this.state.alertsCountLoading === true ? (
                              <div className="ui active inline loader"></div>
                            ) : (
                              <h2>{alertsCount}</h2>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="animated fadeIn data-container-box four wide computer eight wide tablet sixteen wide mobile column">
                      <div className="box-data">
                        <BarChart
                          isLoading={this.state.newDevicesLoading}
                          data={this.props.deviceStore.newDevices}
                          domain={this.state.visualizationXDomain}
                          barsCount={this.state.barsCount}
                          range={this.state.range}
                        />
                        <Loader
                          active={this.state.newDevicesLoading === true}
                        />
                        <div className="box-data-legend">
                          <i className="fas fa-microchip" />
                          <div>
                            <h3>DEVICES</h3>
                            {this.state.newDevicesLoading === true ? (
                              <div className="ui active inline loader"></div>
                            ) : (
                              <h2>{this.props.deviceStore.devicesCount}</h2>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="animated fadeIn data-container-box four wide computer eight wide tablet sixteen wide mobile column">
                      <div className="box-data">
                        <BarChart
                          isLoading={this.state.packetsLoading}
                          data={this.props.deviceStore.packets}
                          domain={this.state.visualizationXDomain}
                          barsCount={this.state.barsCount}
                          range={this.state.range}
                        />
                        <Loader active={this.state.packetsLoading === true} />
                        <div className="box-data-legend">
                          <i className="fas fa-envelope" />
                          <div>
                            <h3>MESSAGES</h3>
                            {this.state.packetsLoading === true ? (
                              <div className="ui active inline loader"></div>
                            ) : (
                              <h2>{packetsCount}</h2>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Segment>
                <Segment>
                  <div className="table-container">
                    <div className="table-container-box">
                      <h3>LATEST ALERTS</h3>
                      <Loader active={this.state.topAlertsLoading === true} />
                      {!this.state.topAlertsLoading && (
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
                                RISK
                              </Table.HeaderCell>
                              <Table.HeaderCell>DESCRIPTION</Table.HeaderCell>
                              <Table.HeaderCell collapsing>
                                DATE
                              </Table.HeaderCell>
                              <Table.HeaderCell collapsing>
                                DevEUI/ADDRESS
                              </Table.HeaderCell>
                              <Table.HeaderCell>DEVICE NAME</Table.HeaderCell>
                              <Table.HeaderCell collapsing>
                                <Popup
                                  trigger={
                                    <span style={{ cursor: "pointer" }}>
                                      IMPORTANCE
                                    </span>
                                  }
                                >
                                  The importance value indicates the
                                  user-defined relevance of the device into the
                                  organization. Can be set for each device in the
                                  Inventory section.
                                </Popup>
                              </Table.HeaderCell>
                              <Table.HeaderCell style={{ maxWidth: "160px" }}>
                                GATEWAY
                              </Table.HeaderCell>
                              <Table.HeaderCell>DATA SOURCE</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <AlertListComponent
                              alerts={this.state.topAlerts}
                              alert_types={this.state.alarmsTypesMap}
                              handleAlertResolution={this.handleAlertResolution}
                              showAlertDetails={this.showAlertDetails}
                            />
                          </Table.Body>
                        </Table>
                      )}
                    </div>
                  </div>
                </Segment>
                {selectedAlert && (
                  <DetailsAlertModal
                    alert={selectedAlert}
                    onClose={this.closeAlertDetails}
                    onNavigate={this.goToAlert}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardComponent;
