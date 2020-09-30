import React, { useEffect, useState, useContext } from "react";
import Chart from "react-apexcharts";
import { MobXProviderContext } from "mobx-react";
import _ from "lodash";
import "./packets-graph-component.css";
import LoaderComponent from "../../loader.component";
import { Grid, Dropdown, Dimmer, Loader, Message } from "semantic-ui-react";
import moment from "moment";
import RangeFilter from "./range-filter-component";

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
  const dateTimeFormat = globalConfigStore.dateFormats.moment.dateTimeFormat;

  const [resourceUsagePacketList, setResourceUsagePacketList] = useState([]);
  const [
    filteredResourceUsagePacketList,
    setFilteredResourceUsagePacketList,
  ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qtyPackets, setQtyPackets] = useState(20);
  const [gatewayList, setGatewayList] = useState([]);
  const [selectedGatewaysId, setSelectedGatewaysId] = useState([]);

  const [rssiFilter, setRssiFilter] = useState({ from: null, to: null });
  const [rssiRange, setRssiRange] = useState({ min: null, max: null });

  const [lsnrFilter, setLsnrFilter] = useState({ from: null, to: null });
  const [lsnrRange, setLsnrRange] = useState({ min: null, max: null });

  // ======================== HANDLER EVENTS ================================
  const handleAfterChangeRssiRange = (data) => {
    if (!_.isEmpty(data)) {
      setRssiFilter({ from: data[0], to: data[1] });
    }
  };

  const handleAfterChangeLsnrRange = (data) => {
    if (!_.isEmpty(data)) {
      setLsnrFilter({ from: data[0], to: data[1] });
    }
  };

  const handleChangeQtyPackets = (event, object) => {
    if (object.value) {
      setQtyPackets(object.value);
    }
  };

  const handleGatewaysOnChange = (event, data) => {
    if (data.value.length >= 1) {
      setSelectedGatewaysId(data.value);
    } else {
      setSelectedGatewaysId(selectedGatewaysId);
    }
  };
  // =======================================================================
  // =========================== UseEffects Hooks ==========================
  useEffect(() => {
    // load data from graph
    if (_.isEmpty(packetList)) {
      // load by ajax
      loadDataForGraph();
    } else {
      setResourceUsagePacketList(packetList); // set it by props
    }
  }, [props.id, props.type, lsnrFilter, rssiFilter]);

  useEffect(() => {
    // build a unique gateway list from api results
    if (!_.isEmpty(resourceUsagePacketList) && _.isEmpty(gatewayList)) {
      let onlyGateways = _.map(
        resourceUsagePacketList,
        _.partialRight(_.pick, ["gateway_id", "gateway"])
      );
      let uniqGateways = _.orderBy(_.uniqBy(onlyGateways, "gateway_id"), [
        "gateway",
        "gateway_id",
        "asc",
        "asc",
      ]);

      let gatewayListForDropdown = Object.keys(uniqGateways).map((key) => {
        return {
          key: uniqGateways[key].gateway_id,
          text: _.toUpper(uniqGateways[key].gateway),
          value: uniqGateways[key].gateway_id,
        };
      });
      setGatewayList(gatewayListForDropdown);
    }
  }, [resourceUsagePacketList]);

  useEffect(() => {
    let filteredResults = resourceUsagePacketList;

    if (!_.isEmpty(selectedGatewaysId)) {
      // if it is not empty filter by gateways. If it empty the filter gateway list: show all
      filteredResults = filteredResults.filter((e) =>
        selectedGatewaysId.includes(e.gateway_id)
      );
    }

    setFilteredResourceUsagePacketList(
      _.takeRight(filteredResults, qtyPackets)
    );
  }, [selectedGatewaysId, resourceUsagePacketList, qtyPackets]);

  // =======================================================================
  // ============================ METHODS ==================================
  const resetRssiRange = () => {
    setRssiFilter({ from: rssiRange.min, to: rssiRange.max });
  };

  const resetLsnrRange = () => {
    setLsnrFilter({ from: lsnrRange.min, to: lsnrRange.max });
  };

  const loadDataForGraph = () => {
    setIsLoading(true);
    if (props.type && props.id) {
      let paramsId = {
        type: props.type.toLowerCase(),
        id: props.id,
      };

      let filterParams = {
        min_rssi: rssiFilter.from,
        max_rssi: rssiFilter.to,
        min_lsnr: lsnrFilter.from,
        max_lsnr: lsnrFilter.to,
      };

      const resourceUsagePromise = commonStore.getData(
        "resource_usage",
        paramsId,
        filterParams
      );

      Promise.all([resourceUsagePromise]).then((response) => {
        let resp = _.get(response, "[0].data");
        setResourceUsagePacketList(_.get(resp, "last_packets_list")); // set data for graph
        // =================== set data related to rssi ===================
        if (_.isNull(rssiRange.min) || _.isNull(rssiRange.max)) {
          // set range for slider and set marks first initialize
          setRssiRange({
            min: resp.min_rssi_packets,
            max: resp.max_rssi_packets,
          });
          setRssiFilter({
            from: resp.min_rssi_packets,
            to: resp.max_rssi_packets,
          });
        }

        // =================== set data related to lsnr ===================
        if (_.isNull(lsnrRange.min) || _.isNull(lsnrRange.max)) {
          setLsnrRange({
            min: resp.min_lsnr_packets,
            max: resp.max_lsnr_packets,
          });
          setLsnrFilter({
            from: resp.min_lsnr_packets,
            to: resp.max_lsnr_packets,
          });
        }

        setIsLoading(false);
      });
    }
  };

  const getCategories = () => {
    if (!_.isEmpty(filteredResourceUsagePacketList)) {
      return filteredResourceUsagePacketList.map((e) => {
        return new Date(e.date).getTime();
      });
    }
  };

  const getSeries = () => {
    if (!_.isEmpty(filteredResourceUsagePacketList)) {
      let rssi = filteredResourceUsagePacketList.map((e) => {
        return e.rssi;
      });
      let snr = filteredResourceUsagePacketList.map((e) => {
        return e.lsnr;
      });
      return [
        {
          name: "Signal Strength (RSSI)",
          type: "line",
          data: rssi,
          other_data: filteredResourceUsagePacketList,
        },
        {
          name: "SNR",
          type: "line",
          data: snr,
          other_data: filteredResourceUsagePacketList,
        },
      ];
    }
  };

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
        y: {
          show: true,
        },
        x: {
          show: true,
          formatter: function(
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            if (!_.isEmpty(filteredResourceUsagePacketList)) {
              return `${moment(value).format(
                dateTimeFormat
              )} - GATEWAY: <strong>${_.toUpper(
                _.get(
                  filteredResourceUsagePacketList,
                  `[${dataPointIndex}].gateway`
                )
              )}</strong>`;
            } else {
              return value;
            }
          },
        },
      },
    },
  };
  // =======================================================================
  // ============================ RENDER  ==================================
  return (
    <React.Fragment>
      {isLoading && _.isEmpty(resourceUsagePacketList) && (
        <LoaderComponent loadingMessage="Loading graph..." />
      )}
      {
        <Grid>
          <Grid.Row style={{ padding: "0px" }}>
            <Grid.Column width={13}>
              {!_.isEmpty(gatewayList) && (
                <React.Fragment>
                  <span>
                    <i>Gateways: </i>
                  </span>
                  <span>
                    <Dropdown
                      placeholder="All"
                      multiple
                      inline
                      search
                      selection
                      options={gatewayList}
                      defaultValue={_.map(gatewayList, "key")}
                      onChange={handleGatewaysOnChange}
                    />
                  </span>
                </React.Fragment>
              )}
            </Grid.Column>
            <Grid.Column width={3}>
              <Dropdown
                className="aligned pull-right"
                onChange={handleChangeQtyPackets}
                options={[
                  { key: 10, text: "Show last 10", value: 10 },
                  { key: 20, text: "Show last 20", value: 20 },
                  { key: 30, text: "Show last 30", value: 30 },
                  { key: 50, text: "Show last 50", value: 50 },
                  { key: 70, text: "Show last 70", value: 70 },
                  { key: 100, text: "Show last 100", value: 100 },
                  { key: 150, text: "Show last 150", value: 150 },
                  { key: 200, text: "Show All (limit to 200)", value: 200 },
                ]}
                compact
                item
                button
                basic
                defaultValue={20}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ padding: "0px" }}>
            <Grid.Column width={8}>
              {(!isLoading || !_.isEmpty(filteredResourceUsagePacketList)) && (
                <RangeFilter
                  onAfterChange={handleAfterChangeRssiRange}
                  range={rssiRange}
                  filter={rssiFilter}
                  onReset={resetRssiRange}
                  label="RSSI"
                  color="#008efb"
                  unit="dBm"
                />
              )}
            </Grid.Column>

            <Grid.Column width={8}>
              {(!isLoading || !_.isEmpty(filteredResourceUsagePacketList)) && (
                <RangeFilter
                  onAfterChange={handleAfterChangeLsnrRange}
                  range={lsnrRange}
                  filter={lsnrFilter}
                  onReset={resetLsnrRange}
                  label="LSNR"
                  color="#e57812"
                  unit="dB"
                />
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              {(!isLoading || !_.isEmpty(filteredResourceUsagePacketList)) && (
                <React.Fragment>
                  <Dimmer active={isLoading} inverted>
                    <Loader>Loading...</Loader>
                  </Dimmer>
                  {_.isEmpty(graphData.series) && (
                    <Message warning>
                      <Message.Header>
                        There is no results for selected filters
                      </Message.Header>
                      <p>
                        Try to change the filtering criteria to get results...
                      </p>
                    </Message>
                  )}
                  {!_.isEmpty(graphData.series) && (
                    <Chart
                      options={graphData.options}
                      series={graphData.series}
                      type="line"
                      height="400"
                    />
                  )}
                </React.Fragment>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }
    </React.Fragment>
  );
};

export default PacketGraph;
