import React, { useState } from "react";
import { Segment, Grid, Loader } from "semantic-ui-react";
import ResourceUsageGraphStatusComponent from "./resource-usage.graph.status.component";
import ResourceUsageGraphGatewaysComponent from "./resource-usage.graph.gateways.component";

const ResourceUsageGraphComponent = (props) => {
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
            {
              <ResourceUsageGraphStatusComponent
                props={props}
              ></ResourceUsageGraphStatusComponent>
            }
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <ResourceUsageGraphGatewaysComponent
              props={props}
            ></ResourceUsageGraphGatewaysComponent>
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
              <div>Histogram</div>
              <ul>
                <li>WEAK</li>
                <li>POOR</li>
                <li>OKAY</li>
                <li>EXCELLENT</li>
              </ul>
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
              <div>Histogram</div>
              <ul>
                <li>with lost between 0% and 10%</li>
                <li>with lost between 10% and 20%</li>
                <li>etc</li>
              </ul>
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
