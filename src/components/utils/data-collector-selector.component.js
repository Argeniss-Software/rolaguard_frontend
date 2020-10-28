import React, { useState, useEffect, useContext } from "react";
import { MobXProviderContext, observer } from "mobx-react";
import { Dropdown } from "semantic-ui-react";
import _ from "lodash";

const DataCollectorSelector = (props) => {
  const { placeholder = "Filter by data source" } = props;
  const [dataCollectorsOptions, setDataCollectorsOptions] = useState([]);
  const [activeCollectors, setActiveCollectors] = useState([]);
  const [totalCollectors, setTotalCollectors] = useState(0);
  const [dataCollectorsSelected, setDataCollectorsSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { dataCollectorStore, generalDataStore } = useContext(
    MobXProviderContext
  );

  useEffect(() => {
    // get list of data collectors
    setIsLoading(true);
    const dataCollectorsPromise = dataCollectorStore.getDataCollectorApi();
    const dataCollectorsCountPromise = generalDataStore.getDataCollectorsCount();
    Promise.all([dataCollectorsPromise, dataCollectorsCountPromise]).then(
      (response) => {
        const totalCollectors = generalDataStore.dataCollectorsCount;
        let activeCollectors =
          dataCollectorStore.dataCollectorList.filter(
            (collector) => collector.status === "CONNECTED"
          ).length || 0;

        setDataCollectorsOptions(
          dataCollectorStore.dataCollectorList
            .filter(
              (collector) =>
                collector.status === "CONNECTED" ||
                collector.status === "DISCONNECTED"
            )
            .sort((collector1, collector2) =>
              collector1.name.localeCompare(collector2.name)
            )
            .map((collector, index) => ({
              key: collector.id,
              text: collector.name,
              value: collector.id,
              label: {
                color: collector.status === "CONNECTED" ? "green" : "red",
                empty: true,
                circular: true,
                size: "mini",
              },
            }))
        );
        setTotalCollectors(totalCollectors);
        setActiveCollectors(activeCollectors);
        setIsLoading(false);
      }
    );
  }, []);

  const handleDataCollectorSelection = (e, { value }) => {
    setDataCollectorsSelected(value);
  };

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange({
        selected: dataCollectorsSelected,
        totalCollectors: totalCollectors,
        activeCollectors: activeCollectors,
        dataCollectorsOptions: dataCollectorsOptions
      });
    }
  }, [
    dataCollectorsSelected,
    totalCollectors,
    activeCollectors,
    dataCollectorsOptions,
  ]);

  return (
      <Dropdown
        placeholder={placeholder}
        fluid
        clearable
        multiple
        search
        selection
        closeOnChange
        options={dataCollectorsOptions}
        loading={isLoading}
        onChange={handleDataCollectorSelection}
        icon={{
          name:
            dataCollectorsSelected && dataCollectorsSelected.length > 0
              ? "delete"
              : "dropdown",
          link: true,
        }}
      />
  );
};

export default observer(DataCollectorSelector);
