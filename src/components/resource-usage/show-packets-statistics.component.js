import * as React from "react";
import { Icon, Table } from "semantic-ui-react";
import NumberFormat from "react-number-format";

import Chart from "react-apexcharts";
import _ from "lodash";
const getDataSeries = (data) => {
  let packetsUpPercentage =_.get(data, "packets_up.percentage", null)
  let packetsDownPercentage = _.get(data, "packets_down.percentage", null)
  let packetsLostPercentage = _.get(data, "packets_lost.percentage", null)
  return [
    (_.isNull(packetsUpPercentage) || packetsUpPercentage==='-') ? 0 : parseFloat(data.packets_up.percentage.toFixed(1)),
    (_.isNull(packetsDownPercentage) || packetsDownPercentage==='-') ? 0 : parseFloat(data.packets_down.percentage.toFixed(1)),
    (_.isNull(packetsLostPercentage) || packetsLostPercentage==='-') ? 0 : parseFloat(data.packets_lost.percentage.toFixed(1)),
  ];
};

const ShowPacketsStatistics = (props) => {
  const data = {
    options: {
      chart: {
        id: "basic-bar",
        animations: {
          enabled: false,
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
            return _.isNumber(val)? val.toFixed(1) : val;
          },
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
        formatter: function(val) {
          return _.isNumber(val)? val.toFixed(1) : val;
        },
      },
      labels: ["Uplink", "Downlink", "Lost"],
      colors: ["#f2711c", "#21ba45", "#767676"],
      fill: {
        type: "gradient",
      },
    },
    series: getDataSeries(props),
  };
  const colorHeaderTable =
    props.headerColorLine === null || props.headerColorLine === undefined
      ? "black"
      : props.headerColorLine;

  const normalizedType = props.type && props.type.toLowerCase().trim();
  const isDevice = normalizedType === 'device'

  return (
    <Table compact="very" celled color={colorHeaderTable}>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">%</Table.HeaderCell>
          <Table.HeaderCell textAlign="center"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Icon color="orange" name="arrow alternate circle up" type="icon" />
            Uplink
          </Table.Cell>
          <Table.Cell textAlign="right">
            <strong>
              <NumberFormat
                value={_.get(props, "packets_up.total")}
                displayType={"text"}
              />
            </strong>
          </Table.Cell>
          <Table.Cell textAlign="right">
            <strong>
              <NumberFormat
                value={_.get(props, "packets_up.percentage")}
                displayType={"text"}
                suffix={"%"}
                decimalScale="2"
              />
            </strong>
          </Table.Cell>
          <Table.Cell rowSpan="4" className="aligned text-center">
            <Chart
              options={data.options}
              series={data.series}
              type="donut"
              width="120"
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Icon
              color="green"
              name="arrow alternate circle down"
              type="icon"
            />
            Downlink
          </Table.Cell>
          <Table.Cell textAlign="right">
            <strong>
              <NumberFormat
                value={_.get(props, "packets_down.total")}
                displayType={"text"}
              />
            </strong>
          </Table.Cell>
          <Table.Cell textAlign="right">
            <strong>
              <NumberFormat
                value={_.get(props, "packets_down.percentage")}
                displayType={"text"}
                suffix={"%"}
                decimalScale="2"
              />
            </strong>
          </Table.Cell>
        </Table.Row>
        {isDevice && (
          <Table.Row>
            <Table.Cell>
              <Icon color="grey" name="exclamation triangle" type="icon" />
              Lost
            </Table.Cell>
            <Table.Cell textAlign="right">
              <strong>
                <NumberFormat
                  value={props.packets_lost.total}
                  displayType={"text"}
                />
              </strong>
            </Table.Cell>
            <Table.Cell textAlign="right">
              <strong>
                <NumberFormat
                  value={props.packets_lost.percentage}
                  displayType={"text"}
                  suffix={"%"}
                  decimalScale="2"
                />
              </strong>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default ShowPacketsStatistics;
