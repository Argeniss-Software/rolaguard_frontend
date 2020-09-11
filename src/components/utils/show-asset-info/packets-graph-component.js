import * as React from "react";
import EmptyComponent from "../../utils/empty.component"
import Chart from "react-apexcharts"
import _ from "lodash"

const PacketGraph = (props) => {

  const getDataSeries = (data) => {
  return [
    _.get(data, "packets_up.percentage", "-") === "-"
      ? 0
      : data.packets_up.percentage,
    _.get(data, "packets_down.percentage", "-") === "-"
      ? 0
      : data.packets_down.percentage,
    _.get(data, "packets_lost.percentage", "-") === "-"
      ? 0
      : data.packets_lost.percentage,
  ];
}
  
const data = {
    options: {
      chart: {
        id: "basic-bar",
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "start",
        offsetX: 200,
        offsetY: 200,
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: ["#fff"],
        },
        dropShadow: {
          enabled: true,
          left: 2,
          top: 2,
          opacity: 0.5,
        },
        formatter: function(val) {
          return val.toFixed(1);
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
          },
        },
      },
      legend: {
        show: false,
        position: "bottom",
        fontSize: "12px",
        fontFamily: "Helvetica, Arial",
        fontWeight: 400,
      },
      labels: ["Uplink", "Downlink", "Lost"],
      colors: ["#f2711c", "#21ba45", "#767676"],
      fill: {
        type: "gradient",
      },
    },
    series: getDataSeries(props),
  };

  const demo_data = {
          
            series: [{
              name: 'Income',
              type: 'line',
              data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
            }, {
              name: 'Cashflow',
              type: 'line',
              data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
            }, {
              name: 'Revenue',
              type: 'line',
              data: [20, 29, 37, 36, 44, 45, 50, 58]
            }],
            options: {
              chart: {
                height: 350,
                type: 'line',
                stacked: false
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: [1, 1, 4]
              },
              title: {
                text: 'XYZ - Stock Analysis (2009 - 2016)',
                align: 'left',
                offsetX: 110
              },
              xaxis: {
                categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
              },
              yaxis: [
                {
                  axisTicks: {
                    show: true,
                  },
                  axisBorder: {
                    show: true,
                    color: '#008FFB'
                  },
                  labels: {
                    style: {
                      colors: '#008FFB',
                    }
                  },
                  title: {
                    text: "Income (thousand crores)",
                    style: {
                      color: '#008FFB',
                    }
                  },
                  tooltip: {
                    enabled: true
                  }
                },
                {
                  seriesName: 'Income',
                  opposite: true,
                  axisTicks: {
                    show: true,
                  },
                  axisBorder: {
                    show: true,
                    color: '#00E396'
                  },
                  labels: {
                    style: {
                      colors: '#00E396',
                    }
                  },
                  title: {
                    text: "Operating Cashflow (thousand crores)",
                    style: {
                      color: '#00E396',
                    }
                  },
                },
                {
                  seriesName: 'Revenue',
                  opposite: true,
                  axisTicks: {
                    show: true,
                  },
                  axisBorder: {
                    show: true,
                    color: '#FEB019'
                  },
                  labels: {
                    style: {
                      colors: '#FEB019',
                    },
                  },
                  title: {
                    text: "Revenue (thousand crores)",
                    style: {
                      color: '#FEB019',
                    }
                  }
                },
              ],
              tooltip: {
                fixed: {
                  enabled: true,
                  position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                  offsetY: 30,
                  offsetX: 60
                },
              },
              legend: {
                horizontalAlign: 'left',
                offsetX: 40
              }
            },
          
          
          }
        

  return (
    <React.Fragment>
      {/*JSON.stringify(props.data)*/}
      <Chart
        options={demo_data.options}
        series={demo_data.series}
        type="line"
      />
    </React.Fragment>
  );
};

export default PacketGraph;
