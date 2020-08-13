import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import {
  Segment,
  Grid,
  Table,
  Pagination,
  TableCell,
  Popup,
  Icon,
  Progress
} from "semantic-ui-react";
import EmptyComponent from "../utils/empty.component";
import LoaderComponent from "../utils/loader.component";
import AssetIdComponent from "../utils/asset-id.component";

import "./resource.component.css";

const ResourceUsageComponent = (props) => {
  const [showFilters, setShowFilters] = React.useState(true);
  const [listState, setListState] = React.useState({
    activePage: 1,
    pagesCount: 1,
    isLoading: false,
    count: 2,
    data: [
      {
        hex_id: "FFFFFFFFFF",
        name: "device name",
        type: "device",
        state: "connected",
        received: 123,
        received_p: 10.5,
        sended: 456,
        sended_p: 50.4,
        lost: 789,
        lost_p: 39.1,
        signal_strength: 50
      },
      {
        hex_id: "0000000000",
        name: "gateway name",
        type: "gateway",
        state: "disconnected",
        received: 123,
        received_p: 10.5,
        sended: 456,
        sended_p: 50.4,
        lost: 789,
        lost_p: 39.1,
        signal_strength: 20
      },
    ],
  });

  const [criteria, setCriteria] = React.useState({
    type: null,
  });

  const clearFilters = () => {};
  const handlePaginationChange = () => {};

  const toggleDeviceType = (type) => {
    /* null stands for both types */
    const order = [null, "gateway", "device"];

    const nextType = order[(order.indexOf(type) + 1) % order.length];
    setCriteria((criteria) => {
      return {
        ...criteria,
        type: nextType,
      };
    });
  };

  const showDeviceTypeIcon = (type) => {
    if (
      type &&
      type.toLowerCase().trim() === "device" &&
      type.toLowerCase() !== "unknown"
    ) {
      return <i className="fas fa-microchip" />;
    }
    if (
      type &&
      type.toLowerCase().trim() === "gateway" &&
      type.toLowerCase() !== "unknown"
    ) {
      return <i className="fas fa-broadcast-tower" />;
    }
    if (type && type.toLowerCase().trim() === "unknown") {
      return <i className="fas fa-question" />;
    }

    return (
      <div>
        <i
          style={{ verticalAlign: "middle" }}
          className="fas fa-broadcast-tower fa-xs"
        />
        /
        <i
          style={{ verticalAlign: "middle" }}
          className="fas fa-microchip fa-xs"
        />
      </div>
    );
  };

  const showStateIcon = (state, lastConnection) => {
    const connectedState = "connected";
    const dissconectedState = "disconnected";

    const statusText = (state && state.trim().toLowerCase() === connectedState) ? connectedState : dissconectedState;
    const colorStatus = statusText === connectedState ? 'green' : 'red';
    
    return (
      <Popup
        trigger= {<Icon color={colorStatus} name="circle" />}
      >
        <Popup.Header>Asset Status</Popup.Header>
        <Popup.Content>
          <Icon color={colorStatus} name="circle" /> {statusText}
        </Popup.Content>
      </Popup>);
  };

  const showMessagesSummary = (received, sended, lost, received_p, sended_p, lost_p) => {
    return (
      <span>
        <Popup
          trigger={
            <span>
              <Icon
                color="green"
                name="arrow alternate circle down "
                type="icon"
              />
              <strong>{received_p}%</strong> /
              <Icon
                color="orange"
                name="arrow alternate circle up"
                type="icon"
              />
              <strong>{sended_p}%</strong> /
              <Icon color="grey" name="exclamation triangle" type="icon" />
              <strong>{lost_p}%</strong>
            </span>
          }
          position="bottom left"
        >
          <div>
            <div>
              <Icon
                color="green"
                name="arrow alternate circle down "
                type="icon"
              />
              Received:
              <strong>
                {received} ({received_p}%)
              </strong>
            </div>
            <div>
              <Icon
                color="orange"
                name="arrow alternate circle up"
                type="icon"
              />
              Sent: 
              <strong>
                {sended} ({sended_p}%)
              </strong>
            </div>
            <div>
              <Icon color="grey" name="exclamation triangle" type="icon" />
              Lost: 
              <strong>
                {lost} ({lost_p}%)
              </strong>
            </div>
          </div>
        </Popup>
      </span>
    );
  };

  return (
    <div className="app-body-container-view">
      <div className="animated fadeIn animation-view">
        <div className="view-header">
          <h1 className="mb0">RESOURCES USAGE</h1>
          <div className="view-header-actions">
            {!showFilters && (
              <div onClick={() => setShowFilters(true)}>
                <i className="fas fa-eye" />
                <span>SHOW SEARCH AND CHARTS</span>
              </div>
            )}
            {showFilters && (
              <div
                onClick={() => setShowFilters(false)}
                style={{ color: "gray" }}
              >
                <i className="fas fa-eye-slash" />
                <span>HIDE SEARCH AND CHARTS</span>
              </div>
            )}
          </div>
        </div>
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
                    <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
                    <i
                      style={{ color: "gray", align: "middle" }}
                      className="fas fa-exclamation fa-4x"
                    ></i>
                  </div>
                </Grid.Column>

                <Grid.Column
                  className="data-container-box pl0 pr0"
                  mobile={16}
                  tablet={8}
                  computer={4}
                >
                  <div className="box-data">
                    <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
                    <i
                      style={{ color: "gray", align: "middle" }}
                      className="fas fa-exclamation fa-4x"
                    ></i>
                  </div>
                </Grid.Column>

                <Grid.Column
                  className="data-container-box pl0 pr0"
                  mobile={16}
                  tablet={8}
                  computer={4}
                >
                  <div className="box-data">
                    <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
                    <i
                      style={{ color: "gray", aling: "middle" }}
                      className="fas fa-exclamation fa-4x"
                    ></i>
                  </div>
                </Grid.Column>

                <Grid.Column
                  className="data-container-box pl0 pr0"
                  mobile={16}
                  tablet={8}
                  computer={4}
                >
                  <div className="box-data">
                    <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
                    <i
                      style={{ color: "gray", aling: "middle" }}
                      className="fas fa-exclamation fa-4x"
                    ></i>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )}
        <div className="view-body">
          <div className="table-container">
            <div className="table-container-box">
              <Segment>
                {showFilters && (
                  <div>
                    <label style={{ fontWeight: "bolder" }}>Filters: </label>
                    <span
                      className="range-select"
                      onClick={() => clearFilters()}
                    >
                      Clear
                    </span>
                  </div>
                )}
                {!listState.isLoading && (
                  <Table
                    striped
                    className="animated fadeIn"
                    basic="very"
                    compact="very"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleDeviceType(criteria.type)}
                          collapsing
                        >
                          {showDeviceTypeIcon(criteria.type)}
                        </Table.HeaderCell>
                        <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                        <Table.HeaderCell>NAME</Table.HeaderCell>
                        <Table.HeaderCell>STATE</Table.HeaderCell>
                        <Table.HeaderCell>
                          MESSAGES <i>(R/S/L)</i>
                        </Table.HeaderCell>
                        <Table.HeaderCell>FREQUENCY</Table.HeaderCell>
                        <Table.HeaderCell>
                          <Icon color="blue" name="wifi" type="icon" />
                          SIGNAL STRENGTH
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    {listState.count === 0 && (
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell colSpan="100%">
                            <EmptyComponent emptyMessage="No assets found" />
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    )}

                    {listState.count > 0 && (
                      <Table.Body>
                        {!listState.isLoading &&
                          listState.data &&
                          listState.data.map((item, index) => {
                            return (
                              <Table.Row
                                key={index}
                                style={{ cursor: "pointer" }}
                              >
                                <Table.Cell style={{ textAlign: "center" }}>
                                  {showDeviceTypeIcon(item.type)}
                                </Table.Cell>
                                <Table.Cell>
                                  <AssetIdComponent
                                    type={item.type}
                                    id={item.hex_id}
                                  />
                                </Table.Cell>
                                <Table.Cell>
                                  {showStateIcon(item.state)}
                                  {item.name}
                                </Table.Cell>
                                <Table.Cell>??</Table.Cell>
                                <Table.Cell>
                                  {showMessagesSummary(
                                    item.received,
                                    item.sended,
                                    item.lost,
                                    item.received_p,
                                    item.sended_p,
                                    item.lost_p
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  {item.package_frequency}
                                </Table.Cell>
                                <Table.Cell>
                                  <Progress
                                    size="medium"
                                    color="green"
                                    value={item.signal_strength}
                                    total={100}
                                    active
                                    progress="percent"
                                  ></Progress>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    )}
                  </Table>
                )}

                {listState.isLoading && (
                  <LoaderComponent
                    loadingMessage="Loading inventory ..."
                    style={{ marginBottom: 20 }}
                  />
                )}
                {!listState.isLoading && listState.pagesCount > 1 && (
                  <Grid className="segment centered">
                    <Pagination
                      className=""
                      activePage={listState.activePage}
                      onPageChange={handlePaginationChange}
                      totalPages={listState.pagesCount}
                    />
                  </Grid>
                )}
              </Segment>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsageComponent;
