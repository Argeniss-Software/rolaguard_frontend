import React, {useState, useEffect } from "react";
import { inject, observer } from "mobx-react";

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

  //this.loadAssetsAndCounts();
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

const ResourceUsageComponent = (props) => {
        const [showFilters, setShowFilters] = React.useState(true);
        const [criteria, setCriteria] = React.useState({
          type: null,
        });

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
              connected: true,
              max_rssi: 50,
              id: 1,
              data_collector: "Chirpstack.io",
              app_name: null,
              packets_down: {total: 3306, per_minute: 4.894177805965373, per_hour: 293.65066835792237, per_day: 7047.616040590136, percentage: 56.59020883259158},
              packets_lost: {total: 3306, per_minute: 4.894177805965373, per_hour: 293.65066835792237, per_day: 7047.616040590136, percentage: 56.59020883259158},
              packets_up: {total: 2536, per_minute: 3.754275534158556, per_hour: 225.25653204951337, per_day: 5406.15676918832, percentage: 43.40979116740842}
            },
            {
              hex_id: "0000000000",
              name: "gateway name",
              type: "gateway",
              connected: true,
              max_rssi: 50,
              id: 1,
              data_collector: "Chirpstack.io",
              app_name: null,
              packets_down: {total: 3306, per_minute: 4.894177805965373, per_hour: 293.65066835792237, per_day: 7047.616040590136, percentage: 56.59020883259158},
              packets_lost: {total: 3306, per_minute: 4.894177805965373, per_hour: 293.65066835792237, per_day: 7047.616040590136, percentage: 56.59020883259158},
              packets_up: {total: 2536, per_minute: 3.754275534158556, per_hour: 225.25653204951337, per_day: 5406.15676918832, percentage: 43.40979116740842}
            },
          ],
        });

        useEffect(() => {
          const assetsPromise = props.resourceUssageStore.getAssets(
            {}, //page: activePage, size: pageSize
            criteria
          );
         Promise.all([assetsPromise]).then((response) => {
           console.log(response[0].data.assets);
           setList((oldList) => {
             response[0].data.assets.map(e => { // preprocess data!
               e.packets_down = {...{total:'-', per_minute:'-', per_hour:'-',per_day:'-',percentage:'-'}, ...e.packets_down}
               e.packets_up = {...{total:'-', per_minute:'-', per_hour:'-',per_day:'-',percentage:'-'}, ...e.packets_up}
               e.packets_lost = {...{total:'-', per_minute:'-', per_hour:'-',per_day:'-',percentage:'-'}, ...e.packets_lost}
             })
             return { ...oldList, data: response[0].data.assets };
           });
         });
        }, 
        []); // Solo se vuelve a ejecutar si cambia lo de []

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
                          <label style={{ fontWeight: "bolder" }}>
                            Filters:{" "}
                          </label>
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