import * as React from "react";
import EmptyComponent from "../../utils/empty.component"
import Chart from "react-apexcharts"
import _ from "lodash"

const PacketGraph = (props) => {
  const packetList = _.get(props, "data.last_packets_list")
  
  const getCategories = () => {
    if (!_.isEmpty(packetList)) {
      return packetList.map((e) => {
        console.log(e.date)
        return new Date(e.date).getTime();
      });
    }
  }
  
  const getSeries = () => {
    if (!_.isEmpty(packetList)) {
      let rssi = packetList.map((e) => {
        return e.rssi;
      });
      let snr = packetList.map((e) => {
        return e.lsnr;
      });
      return [
        {
          name: "Signal Strength (RSSI)",
          type: "line",
          data: rssi,
          other_data: packetList,
        },
        {
          name: "SNR",
          type: "line",
          data: snr,
          other_data: packetList,
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
        width: [4, 4],
      },
      title: {
        text: "Signal Strength (RSSI) and SNR for last 10 packets",
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
          min: -140,
          max: 0,
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
            enabled: true,
          },
        },
        {
          min: -35,
          max: 35,
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
        fixed: {
          enabled: true,
          position: "topRight",
        },
        x: {
          show: true,
          format: "MM/dd/yyyy hh:mm:ss TT",
        },
      },
      legend: {
        //horizontalAlign: "left",
        //offsetX: 40,
      },
    },
  };

  return (
    <React.Fragment>
      {!_.isEmpty(packetList) && (
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
