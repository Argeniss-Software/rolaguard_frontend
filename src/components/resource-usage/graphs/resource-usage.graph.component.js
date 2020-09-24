import React, { } from "react";
import { Segment, Grid } from "semantic-ui-react";
import ResourceUsageGraphStatusComponent from "./resource-usage.graph.status.component";
import ResourceUsageGraphGatewaysComponent from "./resource-usage.graph.gateways.component";
import ResourceUsageGraphPacketsLostComponent from "./resource-usage.graph.packets-lost.component";
import ResourceUsageGraphSignalStrengthComponent from "./resource-usage.graph.signal-strength.component";

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
            <ResourceUsageGraphStatusComponent props={props} />
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <ResourceUsageGraphGatewaysComponent props={props} />
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <ResourceUsageGraphPacketsLostComponent props={props} />
          </Grid.Column>
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <ResourceUsageGraphSignalStrengthComponent props={props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default ResourceUsageGraphComponent;
