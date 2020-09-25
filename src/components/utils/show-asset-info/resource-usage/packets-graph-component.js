import React, {useEffect, useState, useContext} from "react";
import Chart from "react-apexcharts"
import { MobXProviderContext } from "mobx-react";
import _ from "lodash"
import "./packets-graph-component.css"
import LoaderComponent from "../../loader.component"
import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import {Segment, Grid} from "semantic-ui-react";

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
  
  const { createSliderWithTooltip } = Slider
  const Range = createSliderWithTooltip(Slider.Range)

  const [lsnrFilter, setLsnrFilter] = useState({from: -32, to: 32})
  const [lsnrRange, setLsnrRange] = useState({ from: null, to: null });
  const [lsnrMarks, setLsnrMarks] = useState({});

  const [rssiFilter, setRssiFilter] = useState({from: -150, to: 150})
  const [rssiRange, setRssiRange] = useState({ from: null, to: null });
  const [rssiMarks, setRssiMarks] = useState({});
  const [valueRssi, setValueRssi]   = useState([null,null])

  /*useEffect(() => {
    // update slide when reset from and to range
    setValueRssi([rssiFilter.from, rssiFilter.to]);
  }, [rssiFilter.from, rssiFilter.to]);
*/
  const handleAfterChangeRangeRssi = (newRange) => {
    setRssiFilter({ from: newRange[0], to: newRange[1] });
  }

  const loadDataForGraph = () => {
    setIsLoading(true)
    if (props.type && props.id) {
      let paramsId = {
        type: props.type.toLowerCase(),
        id: props.id,        
      }

      let filterParams = {
        min_rssi: rssiFilter.from,
        max_rssi: rssiFilter.to,
        min_lsnr: lsnrFilter.from,
        max_lsnr: lsnrFilter.to
      };

      const resourceUsagePromise = commonStore.getData(
        "resource_usage",
        paramsId,
        filterParams
      );

      Promise.all([resourceUsagePromise]).then((response) => {
        let resp = _.get(response, "[0].data")
        setResourceUsagePacketList(_.get(resp, 'last_packets_list')); // set data for graph

        if (_.isNull(rssiRange.from) || _.isNull(rssiRange.to)) { // set range for slider and set marks first initialize
          setRssiRange({from: resp.min_rssi_packets, to: resp.max_rssi_packets})
          let marksRssi = {}
          marksRssi[resp.min_rssi_packets] = `${resp.min_rssi_packets} dBm`
          marksRssi[resp.max_rssi_packets] = `${resp.max_rssi_packets} dBm`;
          setRssiMarks(marksRssi)
          setValueRssi([resp.min_rssi_packets, resp.max_rssi_packets]);
        }
        if (_.isNull(lsnrRange.from) || _.isNull(lsnrRange.to)) {
          setLsnrRange({from: resp.min_lsnr_packets, to: resp.max_lsnr_packets})
          let marksLsnr = {}
          marksLsnr[resp.min_lsnr_packets] = `${resp.min_lsnr_packets} dB`
          marksLsnr[resp.max_lsnr_packets] = `${resp.max_lsnr_packets} dB`;
          setLsnrMarks(marksLsnr)
        }
        
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
  }, [props.id, props.type, lsnrFilter, rssiFilter])

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
      value: {JSON.stringify(valueRssi)}-- filter: {JSON.stringify(rssiFilter)}
      -- rssi range: {JSON.stringify(rssiRange)}
      {isLoading && _.isEmpty(resourceUsagePacketList) && (
        <LoaderComponent loadingMessage="Loading graph..." />
      )}
      {(!isLoading || !_.isEmpty(resourceUsagePacketList)) && (
        <Grid>
          <Grid.Row>
            <Grid.Column width={1}>
              {/* #4190fb*/}
              <Range
                vertical
                defaultValue={[rssiRange.from, rssiRange.to]}
                allowCross={false}
                min={rssiRange.from}
                max={rssiRange.to}
                //value={[rssiFilter.from,rssiFilter.to]}
                //onChange={(value) => setValueRssi(value)}
                onAfterChange={handleAfterChangeRangeRssi}
                marks={rssiMarks}
                tipFormatter={(value) => `${value} dBm`}
              ></Range>
            </Grid.Column>
            <Grid.Column width={14}>
              <Chart
                options={graphData.options}
                series={graphData.series}
                type="line"
                height="400"
              />
            </Grid.Column>
            <Grid.Column width={1}>#e7852a</Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default PacketGraph;
