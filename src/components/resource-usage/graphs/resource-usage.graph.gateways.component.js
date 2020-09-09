import React, { useEffect } from "react";
import CirclePack from "../../visualizations/circle-pack/circle-pack.component";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";

const ResourceUsageGraphGatewaysComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleItemSelected = (array, selectedItem, type) => {
    resourceUsageStore.setCriteria({ gateways: selectedItem });
  };
 
  useEffect(() => {  
    resourceUsageStore.getDataGatewaysFromApi()
  }, []);

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY GATEWAYS</h5>
      <Loader active={resourceUsageStore.getGatewaysLoading()} />
      {
        <CirclePack
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
