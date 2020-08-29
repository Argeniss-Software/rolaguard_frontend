import React, { useEffect, useState } from "react";
import { Loader, Divider } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./resource-usage.graph.packets-lost.component.css";
import Chart from "react-apexcharts";

const ResourceUsageGraphPacketsLostComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleAfterChange = (data) => {
    if (!_.isEmpty(data)) {
      resourceUsageStore.setCriteria({
        packet_lost_range: { from: data[0], to: data[1] },
      });
    }
  };

  useEffect(() => {
    resourceUsageStore.getDataPacketsLostFromApi();
  }, []); // only execute when change second parameter

  /*const data = {
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
    range: "day",
  };*/

  const marks = {
    0: {
      style: {
        color: "black",
        fontSize: "10px",
      },
      label: <strong>0%</strong>,
    },
    10: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "10",
    },
    20: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "20",
    },
    30: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "30",
    },
    40: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "40",
    },
    50: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "50",
    },
    60: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "60",
    },
    70: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "70",
    },
    80: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "80",
    },
    90: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "90",
    },
    100: {
      style: {
        color: "black",
        fontSize: "9px",
      },
      label: <strong>100%</strong>,
    },
  };

  const defaultPropsRange = {
    width: 90,
    defaultValue: [
      resourceUsageStore.criteria.packet_lost_range.from,
      resourceUsageStore.criteria.packet_lost_range.to,
    ],
    allowCross: false,
    step: 10,
    min: 0,
    max: 100,
    pushable: true,
    marks: marks,
  };

  const [valueState, setValueState] = useState([0, 100]);

  useEffect(() => {
    // update slide when reset from and to range
    setValueState([
      resourceUsageStore.criteria.packet_lost_range.from,
      resourceUsageStore.criteria.packet_lost_range.to,
    ]);
  }, [
    resourceUsageStore.criteria.packet_lost_range.from,
    resourceUsageStore.criteria.packet_lost_range.to,
  ]);

  useEffect(() => {
    resourceUsageStore.getDataPacketsLostFromApi();
  }, []); // only execute when change second parameter

  /*const resetRange = () => {
    setValueState([0, 100]);
    handleAfterChange([0, 100]);
  };*/
  const data = {
    options: {
      chart: {
        id: "basic-bar",
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },

    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: true,
        left: 2,
        top: 2,
        opacity: 0.5,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "35%",
        distributed: true,
      },
    },
    series: [
      {
        name: "Devices with lost packages:",
        data: resourceUsageStore.packetLostsGraph.series,
      },
    ],
    xaxis: {
      type: "category",
    },
  };
  return (
    <div className="box-data">
      <h5 className="visualization-title">BY PACKAGES LOST</h5>
      <Loader active={resourceUsageStore.getStatusLoading()} />
      <Chart
        options={data.options}
        series={data.series}
        type="bar"
        width="120%"
        height="100%"
      />
      <Range
        width={defaultPropsRange.width}
        defaultValue={defaultPropsRange.defaultValue}
        allowCross={defaultPropsRange.allowCross}
        step={defaultPropsRange.step}
        dots
        min={defaultPropsRange.min}
        max={defaultPropsRange.max}
        value={valueState}
        onChange={(value) => setValueState(value)}
        onAfterChange={handleAfterChange}
        pushable={defaultPropsRange.pushable}
        marks={defaultPropsRange.marks}
      ></Range>
      <Divider />
    </div>
  );
};
export default observer(ResourceUsageGraphPacketsLostComponent);
