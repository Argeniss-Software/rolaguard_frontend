import React, { useState, useEffect } from "react";
import { MobXProviderContext } from "mobx-react";

import { Segment, Grid, Pagination } from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";

import "./resource-usage.component.css";
import ResourceUssageGraph from "./resource-usage.graph.component";
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

const ResourceUsageComponent = (props) => {
  const { resourceUssageStore } = React.useContext(MobXProviderContext);
  const [showFilters, setShowFilters] = useState(true);
  const [criteria, setCriteria] = useState({
    type: null,
  });
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalList, setTotalList] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [list, setList] = useState({
    isLoading: true,
    data: [], // resourceUssageStore.getDummyData(),
  });

  
  const handlePaginationChange = (e, { activePage }) => {
    setList((oldData)=>{
      return {...oldData, ...{isLoading: true}}
    })
    setActivePage(activePage);
    getDataFromApi(activePage);
    setList((oldData) => {
      return { ...oldData, ...{ isLoading: false } };
    });
  };

  const getDataFromApi = (activePage, criteria) => {
    setList((oldData) => {
      return { ...oldData, ...{ isLoading: true } };
    });
    const assetsPromise = resourceUssageStore.getAssets(
      { page: activePage, size: pageSize },
      criteria
    );
    Promise.all([assetsPromise]).then((response) => {
      setTotalList(() => response[0].data.total_items);
      setTotalPages(() => response[0].data.total_pages);
      setList((oldList) => {
        return {
          ...oldList,
          ...resourceUssageStore.formatApiData(response[0].data.assets),
        };
      });
    });
    setList((oldData) => {
      return { ...oldData, ...{ isLoading: false } };
    });
  }

  useEffect(() => {getDataFromApi();}, []); // only execute when change second parameter

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
        {showFilters && <ResourceUssageGraph />}
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
                  <div>
                    <ResourceUsageList
                      list={list}
                      criteria={criteria}
                      isLoading={list.isLoading}
                    ></ResourceUsageList>
                  </div>
                )}

                {list.isLoading && (
                  <LoaderComponent
                    loadingMessage="Loading resource usage..."
                    style={{ marginBottom: 20 }}
                  />
                )}
                {!list.isLoading && totalPages > 1 && (
                  <Grid className="segment centered">
                    <Pagination
                      activePage={activePage}
                      onPageChange={handlePaginationChange}
                      totalPages={totalPages}
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
