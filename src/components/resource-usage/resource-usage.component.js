import React, { useState, useEffect } from "react";
import { MobXProviderContext, observer } from "mobx-react";

import { Segment, Grid, Pagination, Label, Icon } from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";

import "./resource-usage.component.css";
import ResourceUssageGraph from "./graphs/resource-usage.graph.component";
import ResourceUsageList from "./resource-usage-list.component";
import _ from 'lodash';

const ResourceUsageComponent = (props) => {
  const { resourceUssageStore } = React.useContext(MobXProviderContext);
  const [showFilters, setShowFilters] = useState(true);
  /*const [criteria, setCriteria] = useState({
    type: null, // device or gateway
    status: null // connected or disconnected
  })*/
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalList, setTotalList] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState(null);
  const [list, setList] = useState({
    isLoading: true,
    data: [], // resourceUssageStore.getDummyData(),
  });
  
  const clearFilters = () => { // clean all criteria filtering
    resourceUssageStore.deleteCriteria()
  }

  const deleteFilter = (k,v) => { // delete specific filter applied from criteria
    let criteriaToDelete={}
    criteriaToDelete[k]=v
    resourceUssageStore.deleteCriteria(criteriaToDelete);
    /*resourceUssageStore.setCriteria(()=>{
      let newCriteria = resourceUssageStore.deleteCriteria(k)
      return { ...resourceUssageStore.getCriteria(), ...newCriteria };
    })*/
  }

  const showAppliedFilters = () => { // show filters applied on filter list
    let labels = [];
    for (const [key, value] of Object.entries(resourceUssageStore.getCriteria())) {
      if (!_.isEmpty(value)) {
        labels.push(
          <Label
            as="a"
            key={key}
            className="text-uppercase"
            onClick={() => {
              deleteFilter(key, value)
            }}
          >
            {key}: <strong>{value}</strong>
            <Icon name="delete" />
          </Label>
        );
      }
    }
    return labels;
  };

  const toggleDeviceTypeFilter = () => { // toggle column device by gateway/device/all
    const order = [null, "gateway", "device"];
    const nextType = order[(order.indexOf(deviceTypeFilter) + 1) % order.length];
    const newCriteria = { type: nextType };
    setActivePage(1);
    setDeviceTypeFilter(nextType);
    resourceUssageStore.setCriteria(() => {
      return { ...resourceUssageStore.getCriteria(), ...newCriteria };
    })
  }

  const handleStatusFilter = (selectedStatus) => {
    resourceUssageStore.setCriteria(() => {
      return { ...resourceUssageStore.getCriteria(), ...{ status: selectedStatus } };
    });
  };
  
  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  const getDataFromApi = () => {
    setList((oldData) => {
      return { ...oldData, ...{ isLoading: true } };
    });
    const assetsPromise = resourceUssageStore.getAssets(
      { page: activePage, size: pageSize},
      resourceUssageStore.getCriteria()
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
  
  useEffect(() => {
    getDataFromApi();
  }, [
    activePage,
    resourceUssageStore.criteria.type,
    resourceUssageStore.criteria.status,
    pageSize,
  ]); // only execute when change second parameter

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
                    {showAppliedFilters()}
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
                      criteria={resourceUssageStore.getCriteria()}
                      isLoading={list.isLoading}
                      deviceTypeClick={toggleDeviceTypeFilter}
                    ></ResourceUsageList>
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
export default observer(ResourceUsageComponent);
