import React, { useState } from "react";
import { Segment, Grid, Loader } from "semantic-ui-react";
import Pie from "../../visualizations/Pie";
import ResourceUsageGraphStatusComponent from "./resource-usage.graph.status.component";

const ResourceUsageGraphComponent = (props) => {
  const types = [
    {
      label: "GATEWAY",
      percentage: 0.1,
      value: 50,
      color: "#103350",
    },
    {
      label: "DEVICES",
      selected: true,
      percentage: 0.8,
      value: 8,
      color: "#1F77B4",
    },
  ];
  //const storeDummyData=getDummyDataForGraphs();

  return (
    <Segment>
      <Grid className="animated fadeIn">
        <Grid.Row id="visualization-container" className="data-container pl pr">
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <ResourceUsageGraphStatusComponent
              props={props}
            ></ResourceUsageGraphStatusComponent>
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 className="visualization-title">BY TYPE</h5>
              <Loader active={props.isGraphsLoading || props.isStatusLoading} />
              {
                <Pie
                  isLoading={props.isGraphsLoading}
                  data={types}
                  type={"types"}
                  handler={props.handleItemSelected}
                />
              }
            </div>
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 className="visualization-title">BY SIGNAL STRENGTH</h5>
              <Loader active={props.isGraphsLoading === true} />
              Weak, Poor, Excellent, etc. HISTOGRAM
              {/* <BarChart
                  isLoading={true}
                  data={this.state.alertsCountArray}
                  domain={this.state.visualizationXDomain}
                  barsCount={this.state.barsCount}
                  range={this.state.range}
                />*/}
              {/*<Pie
                isLoading={props.isGraphsLoading}
                data={props.types}
                type={"types"}
                handler={props.handleItemSelected}
              />*/}
            </div>
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 className="visualization-title">BY PACKAGES LOST</h5>
              <Loader active={props.isGraphsLoading === true} />
              (tipo histograma): - con pérdida del 10-20%, - con pérdida del
              20-30%,ETC.
              {/*<Pie
                isLoading={props.isGraphsLoading}
                data={props.dataCollectors}
                type={"dataCollectors"}
                handler={props.handleItemSelected}
              />*/}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default ResourceUsageGraphComponent;
