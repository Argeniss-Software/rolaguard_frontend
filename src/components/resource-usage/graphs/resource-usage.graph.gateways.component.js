import React, { useState, useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";
import ColorUtil from "../../../util/colors.js";

const ResourceUsageGraphGatewaysComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);
  const [series, setSeries] = useState([]);

  const getDataFromApi = () => {
    resourceUsageStore.setGatewaysLoading(true);
    const statusPromise = resourceUsageStore.getAssetsCountGateways();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(
            resourceUsageStore.getGatewayGraphSeriesSelected()
          )
            ? e.id === resourceUsageStore.getGatewayGraphSeriesSelected().id
            : false,
          percentage: !_.isEmpty(
            resourceUsageStore.getGatewayGraphSeriesSelected()
          )
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: ColorUtil.getByIndex(index),
        };
      });
      if (!_.isEmpty(resourceUsageStore.getGatewayGraphSeriesSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      
      setSeries(apiSeries);
    });    
    resourceUsageStore.setGatewaysLoading(false);
  };

  const handleItemSelected = (array, selectedItem, type) => {
    resourceUsageStore.setGatewayGraphSeriesSelected(selectedItem);
    
/*if (
      !_.isEmpty(resourceUsageStore.getGatewayGraphSeriesSelected()) &&
      resourceUsageStore.getGatewayGraphSeriesSelected().id === selectedItem.id
    ) {
      resourceUsageStore.setGatewayGraphSeriesSelected({});
      resourceUsageStore.setCriteria({ type: null });
    } else {
      resourceUsageStore.setGatewayGraphSeriesSelected(selectedItem);
      resourceUsageStore.setCriteria({ type: selectedItem.id });
    }*/
  };

  useEffect(() => {
    resourceUsageStore.setGatewaysLoading(true);
    if (!_.isEmpty(resourceUsageStore.getGatewayGraphSeriesSelected())) {
      //_.pluck(resourceUsageStore.getGatewayGraphSeriesSelected(), "id")
      if (!_.isEmpty(resourceUsageStore.criteria.gateways)) {
        let gatewaysIdSelected = resourceUsageStore.criteria.gateways.map(
          (e) => e.id
        );
        series.forEach((e) => {
          return (e.selected = gatewaysIdSelected.includes(e.id));
        });
      }
    }
    getDataFromApi();
  }, [
    resourceUsageStore.gatewaysGraph.seriesSelected,
    resourceUsageStore.criteria,
  ]); // only execute when change second parameter

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY GATEWAY</h5>
      
      <Loader active={resourceUsageStore.getGatewaysLoading()} />
      {
        <Pie
          isLoading={resourceUsageStore.getGatewaysLoading()}
          data={series}
          type={"types"}
          handler={handleItemSelected}
        />
      }
    </div>
  );
};
export default observer(ResourceUsageGraphGatewaysComponent);
