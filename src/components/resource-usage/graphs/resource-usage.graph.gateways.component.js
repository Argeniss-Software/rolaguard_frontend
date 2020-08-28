import React, { useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";

const ResourceUsageGraphGatewaysComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleItemSelected = (array, selectedItem, type) => {
    resourceUsageStore.setGatewayGraphSeriesSelected(selectedItem);
  };
 
  useEffect(() => {  
    resourceUsageStore.getDataGatewaysFromApi()
  }, []); // only execute when change second parameter

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY GATEWAYS</h5>
      <div style={{ backgroundColor: "black", color: "white" }}>
        {JSON.stringify(resourceUsageStore.criteria)}
      </div>
      <Loader active={resourceUsageStore.getGatewaysLoading()} />
      {
        <Pie
          isLoading={resourceUsageStore.getGatewaysLoading()}
          data={resourceUsageStore.gatewaysGraph.series}
          type={"types"}
          handler={handleItemSelected}
        />
      }
    </div>
  );
};
export default observer(ResourceUsageGraphGatewaysComponent);
