import React, { useState, useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";

const ResourceUsageGraphStatusComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);
  const [series, setSeries] = useState([]);

  const getDataFromApi = () => {
    resourceUsageStore.setStatusLoading(true);
    const statusPromise = resourceUsageStore.getAssetsCountStatus();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(resourceUsageStore.getStatusGraphSeriesSelected())
            ? e.id === resourceUsageStore.getStatusGraphSeriesSelected().id
            : false,
          percentage: !_.isEmpty(
            resourceUsageStore.getStatusGraphSeriesSelected()
          )
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: index === 0 ? "#21ba45" : "#F05050",
        };
      });
      if (!_.isEmpty(resourceUsageStore.getStatusGraphSeriesSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      setSeries(apiSeries);
    });
    resourceUsageStore.setStatusLoading(false);
  };

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
    if (!_.isEmpty(resourceUsageStore.getStatusGraphSeriesSelected())) {      
      series.forEach((e) => {
        return (e.selected =
          e.id === resourceUsageStore.getStatusGraphSeriesSelected().id);
      });
    }
    getDataFromApi();
  }, [
    resourceUsageStore.statusGraph.seriesSelected,
    resourceUsageStore.criteria,
  ]); // only execute when change second parameter

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY STATUS</h5>
      <Loader active={resourceUsageStore.getStatusLoading()} />

      {
        <Pie
          isLoading={resourceUsageStore.getStatusLoading()}
          data={series}
          type={"types"}
          handler={handleItemSelected}
        />
      }
    </div>
  );
};
export default observer(ResourceUsageGraphStatusComponent);
