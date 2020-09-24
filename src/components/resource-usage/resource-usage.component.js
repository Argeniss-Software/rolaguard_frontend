import React, { useState, useEffect, useContext } from "react";
import { MobXProviderContext, observer } from "mobx-react";

import { Segment, Grid, Pagination, Label, Icon } from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";

import "./resource-usage.component.css";
import ResourceUssageGraph from "./graphs/resource-usage.graph.component";
import ResourceUsageList from "./resource-usage-list.component";
import _ from "lodash";

const ResourceUsageComponent = (props) => {
  const { resourceUsageStore } = useContext(MobXProviderContext);
  const [showFilters, setShowFilters] = useState(true);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState(null);

  const clearFilters = () => {
    // clean all criteria filtering
    resourceUsageStore.deleteCriteria();
  };

  const deleteFilter = (k, v) => {
    // delete specific filter applied from criteria
    let criteriaToDelete = {};
    criteriaToDelete[k] = v;
    resourceUsageStore.deleteCriteria(criteriaToDelete);
  };

  const showAppliedFilters = () => {
    // show filters applied on filter list
    let labels = [];
    for (const [key, value] of Object.entries(
      resourceUsageStore.getCriteria()
    )) {
      if (!_.isEmpty(value)) {
        switch (key) {
          case "status":
          case "type":
            labels.push(
              <Label
                as="a"
                key={key}
                className="text-uppercase"
                onClick={() => {
                  deleteFilter(key, value);
                }}
              >
                {key}: <strong>{value}</strong>
                <Icon name="delete" />
              </Label>
            );
            break;
          case "gateways":
            value.forEach((gatewayInfo) => {
              labels.push(
                <Label
                  as="a"
                  key={gatewayInfo.label}
                  className="text-uppercase"
                  onClick={() => {
                    deleteFilter(key, gatewayInfo);
                  }}
                >
                  {key}: <strong>{gatewayInfo.label}</strong>
                  <Icon name="delete" />
                </Label>
              );
            });
            break;
          case "packet_lost_range":
            if (value.from !== 0 || value.to !== 100) {
              labels.push(
                <Label
                  as="a"
                  key={key}
                  className="text-uppercase"
                  onClick={() => {
                    deleteFilter(key, value);
                  }}
                >
                  {key.replace(/\_+/gm, ` `)}:{" "}
                  <strong>
                    {value.from}-{value.to}%
                  </strong>
                  <Icon name="delete" />
                </Label>
              );
            }
            break;
          case "signal_strength":
            if (value.from !== -150 || value.to !== 0) {
              labels.push(
                <Label
                  as="a"
                  key={key}
                  className="text-uppercase"
                  onClick={() => {
                    deleteFilter(key, value);
                  }}
                >
                  {key.replace(/\_+/gm, ` `)}:{" "}
                  <strong>
                    {value.from <-120 ? '-Inf' : value.from} to {value.to > -50 ? '0' : value.to} dBm 
                  </strong>
                  <Icon name="delete" />
                </Label>
              );
            }
            break
          default: 
            break
        }
      }
    }
    return labels;
  };

  const toggleDeviceTypeFilter = () => {
    // toggle column device by gateway/device/all
    const order = [null, "gateway", "device"];
    const nextType =
      order[(order.indexOf(deviceTypeFilter) + 1) % order.length];
    const newCriteria = { type: nextType };
    setDeviceTypeFilter(nextType);
    resourceUsageStore.setCriteria(newCriteria);
  };
  const handlePaginationChange = (e, { activePage }) => {
    resourceUsageStore.setActivePage(activePage);
  };

  useEffect(() => {
    resourceUsageStore.getDataListFromApi();
    return () => {
      resourceUsageStore.deleteCriteria();
    };
  }, []);

  return (
    <div className="app-body-container-view">
      <div className="animated fadeIn animation-view">
        <div className="view-header">
          <h1 className="mb0">NETWORK OVERVIEW</h1>
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
                  <React.Fragment>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={12}>
                          <label style={{ fontWeight: "bolder" }}>
                            Filters:{" "}
                          </label>
                          {showAppliedFilters()}
                          <span
                            className="range-select"
                            onClick={() => clearFilters()}
                          >
                            Clear
                          </span>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          {" "}
                          <div className="right pull-right aligned">
                            Page{" "}
                            <strong>
                              {resourceUsageStore.model.activePage}
                            </strong>{" "}
                            of{" "}
                            <strong>
                              {resourceUsageStore.model.totalPages}
                            </strong>{" "}
                            - Total Results:{" "}
                            <strong>
                              {resourceUsageStore.model.totalList}
                            </strong>
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </React.Fragment>
                )}

                {!resourceUsageStore.model.isLoading && (
                  <ResourceUsageList
                    list={resourceUsageStore.model.list}
                    criteria={resourceUsageStore.getCriteria()}
                    isLoading={resourceUsageStore.model.isLoading}
                    deviceTypeClick={toggleDeviceTypeFilter}
                  ></ResourceUsageList>
                )}

                {resourceUsageStore.model.isLoading && (
                  <LoaderComponent
                    loadingMessage="Loading network overview..."
                    style={{ marginBottom: 20 }}
                  />
                )}
                {!resourceUsageStore.model.isLoading &&
                  resourceUsageStore.model.totalPages > 1 && (
                    <Grid className="segment centered">
                      <Pagination
                        activePage={resourceUsageStore.model.activePage}
                        onPageChange={handlePaginationChange}
                        totalPages={resourceUsageStore.model.totalPages}
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
