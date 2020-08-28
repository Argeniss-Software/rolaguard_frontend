import React, { useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";
import SliderComponent from "../../utils/slider.component"

const ResourceUsageGraphPacketsLostComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleChange = (data) => {
    if (!_.isEmpty(data)) {
      resourceUsageStore.setCriteria({
        packet_lost_range: { from: data[0], to: data[1] },
      });
    }
  };

  useEffect(() => {
    resourceUsageStore.getDataPacketsLostFromApi();
  }, []); // only execute when change second parameter
  
  const data = {
    data: [
      { xValue: 0, yValue: 13, color: "#f05050" },
      { xValue: 10, yValue: 10, color: "#ff902b" },
      { xValue: 20, yValue: 9, color: "#ff902b" },
      { xValue: 30, yValue: 9, color: "#ff902b" },
      { xValue: 4, yValue: 6, color: "#ff902b" },
      { xValue: 50, yValue: 4, color: "#5d9cec" },
      { xValue: 100, yValue: 3, color: "#5d9cec" },
    ],
    domain: { from: 0, to: 100 },
    barsCount: 7,
    range: "day"
  }

  return (
    <div className="box-data">
      <h5 className="visualization-title">BY PACKAGES LOST</h5>
      <Loader active={resourceUsageStore.getStatusLoading()} />
      <div>Histogram</div>
      
      <SliderComponent onChange={handleChange}></SliderComponent>
    </div>
  )
}
export default observer(ResourceUsageGraphPacketsLostComponent);
