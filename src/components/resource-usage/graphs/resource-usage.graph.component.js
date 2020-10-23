import React, { } from "react";
import { MobXProviderContext, observer } from "mobx-react";
import { Segment, Grid } from "semantic-ui-react";
import ResourceUsageGraphStatusComponent from "./resource-usage.graph.status.component";
import ResourceUsageGraphGatewaysComponent from "./resource-usage.graph.gateways.component";
import ResourceUsageGraphPacketsLostComponent from "./resource-usage.graph.packets-lost.component";
import ResourceUsageGraphSignalStrengthComponent from "./resource-usage.graph.signal-strength.component";
import DataCollectorSelector from "../../utils/data-collector-selector.component";

const ResourceUsageGraphComponent = (props) => {
  //const storeDummyData=getDummyDataForGraphs();
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleChangeDataCollector = (params) => {
    resourceUsageStore.setCriteria({ data_collectors: params.selected });
  }

  return (
    <Segment>
      <Grid className="animated fadeIn">
        <Grid.Row className="data-container pl pr">
          <DataCollectorSelector onChange={handleChangeDataCollector} />
        </Grid.Row>
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
