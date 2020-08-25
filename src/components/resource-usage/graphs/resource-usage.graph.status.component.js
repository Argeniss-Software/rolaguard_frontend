import React, { useState, useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";

const ResourceUsageGraphStatusComponent = (props) => {
  const [isLoading, setIsLoading] = useState(null);

  const { resourceUsageStore } = React.useContext(MobXProviderContext);
  const [series, setSeries] = useState([]);

  const getDataFromApi = () => {
    setIsLoading(true);
    const statusPromise = resourceUsageStore.getAssetsCountStatus();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(
            resourceUsageStore.getStatusGraphSerieSelected()
          )
            ? e.id === resourceUsageStore.getStatusGraphSerieSelected().id
            : false,
          percentage: !_.isEmpty(
            resourceUsageStore.getStatusGraphSerieSelected()
          )
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: index === 0 ? "#21ba45" : "#db2828",
        };
      });
      if (!_.isEmpty(resourceUsageStore.getStatusGraphSerieSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      setSeries(apiSeries);
    });
    setIsLoading(false);
  };

  const handleItemSelected = (array, selectedItem, type) => {
    if (
      resourceUsageStore.getStatusGraphSerieSelected() &&
      resourceUsageStore.getStatusGraphSerieSelected().id === selectedItem.id
    ) {
      resourceUsageStore.setStatusGraphSerieSelected({});
      resourceUsageStore.setCriteria({ status: null });
      //props.statusFilterHandler()
    } else {
      resourceUsageStore.setStatusGraphSerieSelected(selectedItem);
      resourceUsageStore.setCriteria({ status: selectedItem.id });
      //props.statusFilterHandler(selectedItem.id)
    }
  };

  useEffect(() => {
    if (!_.isEmpty(resourceUsageStore.getStatusGraphSerieSelected())) {
      setIsLoading(true);
      series.forEach((e) => {
        return (e.selected =
          e.id === resourceUsageStore.getStatusGraphSerieSelected().id);
      });
    }

    setIsLoading(true);
    /*if (_.isEmpty(resourceUsageStore.criteria.status)){
            setStatusGraphSerieSelected({});
          }*/
    getDataFromApi();
  }, [
    resourceUsageStore.statusGraph.serieSelected,
    resourceUsageStore.criteria.status,
  ]); // only execute when change second parameter

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY STATUS</h5>      
      <Loader active={isLoading === true} />
      {
        <Pie
          isLoading={isLoading}
          data={series}
          type={"types"}
          handler={handleItemSelected}
        />
      }
    </div>
  );
};
export default observer(ResourceUsageGraphStatusComponent);
