import React, { useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";

const ResourceUsageGraphStatusComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleItemSelected = (array, selectedItem, type) => {
    if (
      resourceUsageStore.getStatusGraphSeriesSelected() &&
      resourceUsageStore.getStatusGraphSeriesSelected().id === selectedItem.id
    ) {
      resourceUsageStore.setStatusGraphSeriesSelected({});
      resourceUsageStore.setCriteria({ status: null });
    } else {
      resourceUsageStore.setStatusGraphSeriesSelected(selectedItem);
      resourceUsageStore.setCriteria({ status: selectedItem.id });
    }
  };

  useEffect(() => {    
    resourceUsageStore.getDataStatusFromApi();
  }, []); // only execute when change second parameter

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY STATUS</h5>
      <Loader active={resourceUsageStore.getStatusLoading()} />
      {
        <Pie
          isLoading={resourceUsageStore.getStatusLoading()}
          data={resourceUsageStore.statusGraph.series}
          type={"types"}
          handler={handleItemSelected}
        />
      }
    </div>
  );
};
export default observer(ResourceUsageGraphStatusComponent)
