import React, { useState, useEffect } from "react";
import Pie from "../../visualizations/Pie";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext } from "mobx-react";
import _ from 'lodash'

const ResourceUsageGraphStatusComponent = (props) => {
        const [status, setStatus] = useState(null);
        const [serieSelected, setSerieSelected] = useState(null);
        const [isLoading, setIsLoading] = useState(null);
        const [criteria, setCriteria] = useState({});

        const { resourceUssageStore } = React.useContext(MobXProviderContext);
        const [series, setSeries] = useState([
        ]);

        const getDataFromApi = () => {
          setIsLoading(true);
          const statusPromise = resourceUssageStore.getAssetsCountStatus(
            criteria
          );
          Promise.all([statusPromise]).then((response) => {
            let total = response[0].data.reduce(
              (a, b) => a + (b["count"] || 0),
              0
            );
            let apiSeries = response[0].data.map((e, index) => {
              return {
                label: e.name.toUpperCase(),
                id: e.id,
                selected: !_.isEmpty(serieSelected) ? e.id === serieSelected.id : false,
                percentage: !_.isEmpty(serieSelected) ? 1 :(total > 0 ? e.count / total : e.count),
                value: e.count,
                color: index === 0 ? "#21ba45" : "#db2828",
              };
            });
            if (!_.isEmpty(serieSelected)) {
              apiSeries = apiSeries.filter(
                (item) => item.selected
              )
            }

            setSeries(apiSeries);
          });
          setIsLoading(false);
        };

        const handleItemSelected = (array, selectedItem, type) => {
          if (serieSelected && serieSelected.id === selectedItem.id) {
            setSerieSelected({})
            setCriteria({})
            props.statusFilterHandler()
          } else {
            setSerieSelected(selectedItem)
            setCriteria({ asset_status: selectedItem.id })
            props.statusFilterHandler(selectedItem.id)
          }
        }

        useEffect(() => {
          if (!_.isEmpty(serieSelected)) {
            setIsLoading(true);
            series.forEach((e) => {
              return (e.selected = e.id === serieSelected.id);
            });
          }          
        }, [serieSelected]); // only execute when change second parameter

        useEffect(() => {
          setIsLoading(true);
          getDataFromApi();
        }, [serieSelected]); // only execute when change second parameter

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
      };;;;;
export default ResourceUsageGraphStatusComponent;
