import React, {
    useEffect,
    useState,
    useContext
} from "react";
import Chart from "react-apexcharts";
import {
    MobXProviderContext
} from "mobx-react";
import _ from "lodash";

const AlertTimeLineGraph = (props) => {
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

    const {
        commonStore
    } = useContext(MobXProviderContext);
    const packetList = _.get(props, "data.last_packets_list");
    const [resourceUsagePacketList, setResourceUsagePacketList] = useState([]);

    const loadDataForGraph = () => {
        if (props.type && props.id) {
            let paramsId = {
                type: props.type,
                id: props.id,
            };

            const resourceUsagePromise = commonStore.getData(
                "resource_usage",
                paramsId
            );

            Promise.all([resourceUsagePromise]).then((response) => {
                setResourceUsagePacketList(
                    _.get(response, "[0].data.last_packets_list")
                );
            });
        }
    };

    useEffect(() => {
        if (_.isEmpty(packetList)) {
            // load by ajax
            loadDataForGraph();
        } else {
            setResourceUsagePacketList(packetList); // set it by props
        }
    }, [props.id, props.type]);

    const getCategories = () => {
        if (!_.isEmpty(resourceUsagePacketList)) {
            return resourceUsagePacketList.map((e) => {
                return new Date(e.date).getTime();
            });
        }
    };

    const getSeries = () => {
        return [{
                data: [{
                        x: 'Analysis',
                        y: [
                            new Date('2019-02-27').getTime(),
                            new Date('2019-03-04').getTime()
                        ],
                        fillColor: '#008FFB'
                    },
                    {
                        x: 'Design',
                        y: [
                            new Date('2019-03-04').getTime(),
                            new Date('2019-03-08').getTime()
                        ],
                        fillColor: '#00E396'
                    },
                    {
                        x: 'Coding',
                        y: [
                            new Date('2019-03-07').getTime(),
                            new Date('2019-03-10').getTime()
                        ],
                        fillColor: '#775DD0'
                    },
                    {
                        x: 'Testing',
                        y: [
                            new Date('2019-03-08').getTime(),
                            new Date('2019-03-12').getTime()
                        ],
                        fillColor: '#FEB019'
                    },
                    {
                        x: 'Deployment',
                        y: [
                            new Date('2019-03-12').getTime(),
                            new Date('2019-03-17').getTime()
                        ],
                        fillColor: '#FF4560'
                    }
                ]
            }],
            /*if (!_.isEmpty(resourceUsagePacketList)) {
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
            }*/
    }

    const graphData = {
        series: getSeries(),
        options: {
            chart: {
                height: 350,
                type: 'rangeBar'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    distributed: true,
                    dataLabels: {
                        hideOverflowingLabels: false
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    var label = opts.w.globals.labels[opts.dataPointIndex]
                    var a = moment(val[0])
                    var b = moment(val[1])
                    var diff = b.diff(a, 'days')
                    return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
                },
                style: {
                    colors: ['#f3f4f5', '#fff']
                }
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                show: false
            },
            grid: {
                row: {
                    colors: ['#f3f4f5', '#fff'],
                    opacity: 1
                }
            }
        }
    };

    return ( <
        React.Fragment > {
            !_.isEmpty(resourceUsagePacketList) && ( <
                Chart options = {
                    graphData.options
                }
                series = {
                    graphData.series
                }
                type = "rangeBar"
                height = "400" /
                >
            )
        } <
        /React.Fragment>
    );
};

export default AlertTimeLineGraph;