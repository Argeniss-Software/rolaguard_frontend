import React, {useEffect, useState, useContext} from "react";
import Chart from "react-apexcharts"
import { MobXProviderContext } from "mobx-react";
import _ from "lodash"
import "./packets-graph-component.css"
import LoaderComponent from "../loader.component"

const PacketGraph = (props) => {
  /* 
  * This component graph a packet list RSSI and SNR(Y) on the time (X). 
  * You can pass the values to graph as props (data param) or the component 
  * itself can get the data doing an ajax request (when you pass id and type param):
  * - by props: pass props.data.last_packets_list array (no ajax call)
  * - by ajax: pass props.id and props.type of an asset. In this case the component encourage the ajax call for get data
  * 
  * @param data [optional if type and id are not empty]: array of package list with the structure defined on resource usage
  * @param type [optional if data is not empty]: the string type of asset. Possible options: [gateway, device]
  * @param id [optional if data is not empty]: the id of the asset
  * 
  * @return graph
  */
 
  const { commonStore, globalConfigStore } = useContext(MobXProviderContext);
  const packetList = _.get(props, "data.last_packets_list");
  const [resourceUsagePacketList, setResourceUsagePacketList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadDataForGraph = () => {
    setIsLoading(true)
    if (props.type && props.id) {
      let paramsId = {
        type: props.type,
        id: props.id,
      }

      const resourceUsagePromise = commonStore.getData(
        "resource_usage",
        paramsId
      );

      Promise.all([resourceUsagePromise]).then((response) => {
        setResourceUsagePacketList(_.get(response, "[0].data.last_packets_list"));
        setIsLoading(false);
      });
    }
  }

  useEffect(() => {
    if (_.isEmpty(packetList)) { // load by ajax
      loadDataForGraph();
    } else {
      setResourceUsagePacketList(packetList); // set it by props
    }
  }, [props.id, props.type])

  const getCategories = () => {
    if (!_.isEmpty(resourceUsagePacketList)) {
      return resourceUsagePacketList.map((e) => {
        return new Date(e.date).getTime();
      });
    }
  }
  
  const getSeries = () => {
    if (!_.isEmpty(resourceUsagePacketList)) {
      let rssi = resourceUsagePacketList.map((e) => {
        return e.rssi;
      });
      let snr = resourceUsagePacketList.map((e) => {
        return e.lsnr;
      });
      return [
        {
          name: "Signal Strength (RSSI)",
          type: "line",
          data: rssi,
          other_data: resourceUsagePacketList,
        },
        {
          name: "SNR",
          type: "line",
          data: snr,
          other_data: resourceUsagePacketList,
        },
      ];
    }
}

  const graphData = {
    series: getSeries(),
    options: {
      chart: {
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      colors: ["#008FFB", "#E57812"],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
      },
      stroke: {
        width: [2, 2],
      },
      title: {
        text: "Signal Strength (RSSI) and SNR for last 200 packets",
        align: "center",
      },
      xaxis: {
        categories: getCategories(),
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm TT",
          },
        },
      },
      yaxis: [
        {
          /*min: -140,
          max: 0,*/
          axisTicks: {
            show: true,
            offsetX: -20,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
            width: [1],
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
            formatter: function(value) {
              return value ? value.toFixed(2) + " dBm" : value;
            },
            offsetX: -17,
          },
          title: {
            text: "Signal Strength - RSSI (dBm)",
            style: {
              color: "#008FFB",
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        {
          /*min: -35,
          max: 35,*/
          seriesName: "SNR",
          opposite: true,
          axisTicks: {
            show: true,
            offsetX: -20,
          },
          axisBorder: {
            show: true,
            color: "#E57812",
            width: [1],
          },
          labels: {
            style: {
              colors: "#E57812",
            },
            formatter: function(value) {
              return value ? value.toFixed(2) + " dB" : value;
            },
            offsetX: -17,
          },
          title: {
            text: "SNR (dB)",
            style: {
              color: "#E57812",
            },
          },
        },
      ],
      
      tooltip: {
        x: {
          show: true,
          format: globalConfigStore.dateFormats.apexchart.dateTimeFormat
        },
      }
    },
  };

  return (
    <React.Fragment>
      {(isLoading && _.isEmpty(resourceUsagePacketList)) && (
        <LoaderComponent loadingMessage="Loading graph..." />
      )}
      {(!isLoading || !_.isEmpty(resourceUsagePacketList)) && (
        <Chart
          options={graphData.options}
          series={graphData.series}
          type="line"
          height="400"
        />
      )}
    </React.Fragment>
  );
};

export default PacketGraph;
