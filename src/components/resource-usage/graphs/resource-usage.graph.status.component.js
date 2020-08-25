import React, { useState, useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";

const ResourceUsageGraphStatusComponent = (props) => {
  const [isLoading, setIsLoading] = useState(null);

  const { resourceUssageStore } = React.useContext(MobXProviderContext);
  const [series, setSeries] = useState([]);

  const getDataFromApi = () => {
    setIsLoading(true);
    const statusPromise = resourceUssageStore.getAssetsCountStatus();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(
            resourceUssageStore.getStatusGraphSerieSelected()
          )
            ? e.id === resourceUssageStore.getStatusGraphSerieSelected().id
            : false,
          percentage: !_.isEmpty(
            resourceUssageStore.getStatusGraphSerieSelected()
          )
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: index === 0 ? "#21ba45" : "#db2828",
        };
      });
      if (!_.isEmpty(resourceUssageStore.getStatusGraphSerieSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      setSeries(apiSeries);
    });
    setIsLoading(false);
  };

  const handleItemSelected = (array, selectedItem, type) => {
    if (
      resourceUssageStore.getStatusGraphSerieSelected() &&
      resourceUssageStore.getStatusGraphSerieSelected().id === selectedItem.id
    ) {
      resourceUssageStore.setStatusGraphSerieSelected({});
      resourceUssageStore.setCriteria({ status: null });
      //props.statusFilterHandler()
    } else {
      resourceUssageStore.setStatusGraphSerieSelected(selectedItem);
      resourceUssageStore.setCriteria({ status: selectedItem.id });
      //props.statusFilterHandler(selectedItem.id)
    }
  };

  useEffect(() => {
    if (!_.isEmpty(resourceUssageStore.getStatusGraphSerieSelected())) {
      setIsLoading(true);
      series.forEach((e) => {
        return (e.selected =
          e.id === resourceUssageStore.getStatusGraphSerieSelected().id);
      });
    }

    setIsLoading(true);
    /*if (_.isEmpty(resourceUssageStore.criteria.status)){
            setStatusGraphSerieSelected({});
          }*/
    getDataFromApi();
  }, [
    resourceUssageStore.statusGraph.serieSelected,
    resourceUssageStore.criteria.status,
  ]); // only execute when change second parameter

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY STATUS</h5>
      <div style={{ backgroundColor: "black", color: "white" }}>
        serie: {JSON.stringify(series)}
      </div>
      <div style={{ backgroundColor: "black", color: "white" }}>
        Serie selected:{" "}
        {JSON.stringify(resourceUssageStore.getStatusGraphSerieSelected())}
      </div>
      <div style={{ backgroundColor: "black", color: "white" }}>
        criteria:
        {JSON.stringify(resourceUssageStore.criteria)}
      </div>
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
