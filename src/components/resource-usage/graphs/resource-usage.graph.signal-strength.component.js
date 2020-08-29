import React, { useEffect, useState } from "react";
import { Loader, Divider } from "semantic-ui-react";
import { MobXProviderContext, observer } from "mobx-react";
import _ from "lodash";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./resource-usage.graph.packets-lost.component.css";
import Chart from "react-apexcharts";

const ResourceUsageGraphSignalStrengthComponent = (props) => {
  const { resourceUsageStore } = React.useContext(MobXProviderContext);

  const handleAfterChange = (data) => {
    if (!_.isEmpty(data)) {
      resourceUsageStore.setCriteria({
        signal_strength: { from: data[1] * -1, to: data[0] * -1 },
      });
    }
  }

  useEffect(() => {
    resourceUsageStore.getDataSignalStrengthFromApi();
  }, []); // only execute when change second parameter

  const marks = {
    0: {
      style: {
        color: "black",
        fontSize: "10px",
      },
      label: <strong>0dBm</strong>,
    },
    50: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "-50",
    },
    75: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "-75",
    },
    100: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "-100",
    },
    110: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "-110",
    },
    120: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "-120",
    },
    130: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: "-130",
    },
    150: {
      style: {
        color: "black",
        fontSize: "10px",
        bottom: "-15px",
      },
      label: <strong>-150dBm</strong>,
    },
  };

  const defaultPropsRange = {
    width: 90,
    defaultValue: [
      Math.abs(resourceUsageStore.criteria.signal_strength.from),
      Math.abs(resourceUsageStore.criteria.signal_strength.to),
    ],
    allowCross: false,
    step: null,
    min: 0,
    max: 150,
    pushable: true,
    marks: marks,
    reverse: true
  };

  const [valueState, setValueState] = useState([0, 150]);

  useEffect(() => {
    // update slide when reset from and to range
    setValueState([
      resourceUsageStore.criteria.signal_strength.to*-1,
      resourceUsageStore.criteria.signal_strength.from*-1,
    ]);
  }, [
    resourceUsageStore.criteria.signal_strength.from,
    resourceUsageStore.criteria.signal_strength.to,
  ]);  

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
        name: "Devices with this signal strength",
        data: resourceUsageStore.signalStrengthGraph.series,
      },
    ],
    xaxis: {
      type: "category",
    },
  };
  return (
    <div className="box-data">
      <h5 className="visualization-title">BY SIGNAL STRENGTH</h5>
      <Chart
        options={data.options}
        series={data.series}
        type="bar"
        width="120%"
      />

      <Range
        width={defaultPropsRange.width}
        defaultValue={defaultPropsRange.defaultValue}
        allowCross={defaultPropsRange.allowCross}
        step={defaultPropsRange.step}
        min={defaultPropsRange.min}
        max={defaultPropsRange.max}
        value={valueState}
        onChange={(value) => setValueState(value)}
        onAfterChange={handleAfterChange}
        pushable={defaultPropsRange.pushable}
        marks={defaultPropsRange.marks}
        reverse={defaultPropsRange.reverse}
      ></Range>
      <Divider />
    </div>
  );
};
export default observer(ResourceUsageGraphSignalStrengthComponent);

