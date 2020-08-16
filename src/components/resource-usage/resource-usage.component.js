import React, {useState } from "react";
import { observer, inject } from "mobx-react";

import {
  Segment,
  Grid,
  Pagination,
} from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";

import "./resource-usage.component.css";
import ResourceUsageList from "./resource-usage-list.component";

//******************************************************* */
const clearFilters = () => {
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
    pageSize: 50,
    isGraphsLoading: true,
    isLoading: true,
  });

  this.loadAssetsAndCounts();
};

const handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, isLoading: true });
    const { criteria, pageSize, selectedAlert } = this.state;

    const assetsPromise = this.props.inventoryAssetsStore.getAssets(
      { page: activePage, size: pageSize },
      criteria
    );

    Promise.all([assetsPromise]).then((response) => {
      this.setState({
        selectAll: false,
        assets: response[0].data.assets,
        assetsCount: response[0].data.total_items,
        pagesCount: response[0].data.total_pages,
        isLoading: false,
      });
    });

    return assetsPromise;
  };

//******************************************************* */
// const { activePage, pageSize, criteria } = this.state;
const loadAssets = (props) => {
  const assetsPromise = props.resourceUssageStore.getAssets(
    {},
    //{ page: activePage, size: pageSize },
    {}
    //criteria
  );
  Promise.all([assetsPromise]).then(
        (responses) => {
          console.log(responses[0].data);
          //this.setState({data: responses[0].data});
      }
  );
}

const ResourceUsageComponent = (props) => {
  const [showFilters, setShowFilters] = React.useState(true);
  const [criteria, setCriteria] = React.useState({
    type: null,
  });
  
  loadAssets(props);

  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  
  const [list, setList] = React.useState({
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
        signal_strength: 50,
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
        signal_strength: 20,
      },
    ],
  });

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
                {!list.isLoading && (
                  <ResourceUsageList
                    list={list}
                    criteria={criteria}
                  ></ResourceUsageList>
                )}

                {list.isLoading && (
                  <LoaderComponent
                    loadingMessage="Loading resource usage..."
                    style={{ marginBottom: 20 }}
                  />
                )}
                {!list.isLoading && list.pagesCount > 1 && (
                  <Grid className="segment centered">
                    <Pagination
                      className=""
                      activePage={list.activePage}
                      onPageChange={handlePaginationChange}
                      totalPages={list.pagesCount}
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

export default inject("resourceUssageStore")(ResourceUsageComponent);
