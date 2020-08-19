import * as React from "react";
import { Icon, Popup, Grid, Table } from "semantic-ui-react";
import NumberFormat from "react-number-format";

import Chart from "react-apexcharts";
const ShowMessagesSummary = (props) => {
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
      legend: {
        show: false,
        position: "bottom",
        fontSize: "12px",
        fontFamily: "Helvetica, Arial",
        fontWeight: 400,
      },
      labels: ["Sent", "Received", "Lost"],
      colors: ["#f2711c", "#21ba45", "#767676"],
      fill: {
        type: "gradient",
      },
    },
    series: [
      props.packets_up.percentage == "-" ||
      props.packets_up.percentage == null
        ? 0
        : props.packets_up.percentage,
      props.packets_down.percentage == "-" ||
      props.packets_down.percentage == null
        ? 0
        : props.packets_down.percentage,
      props.packets_lost.percentage == "-" ||
      props.packets_lost.percentage == null
        ? 0
        : props.packets_lost.percentage,
    ],
  };
  return (
    <span>
      <Popup
        position="left center"
        flowing
        trigger={
          <span>
            <Grid divided>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Icon
                    color="green"
                    name="arrow alternate circle down"
                    type="icon"
                  />
                  <strong>
                    <NumberFormat
                      value={props.packets_down.total}
                      displayType={"text"}
                    />
                  </strong>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Icon
                    color="orange"
                    name="arrow alternate circle up"
                    type="icon"
                  />
                  <strong>
                    <NumberFormat
                      value={props.packets_up.total}
                      displayType={"text"}
                    />
                  </strong>
                </Grid.Column>
                <Grid.Column width={4}>
                  {props.type == "device" && (
                    <React.Fragment>
                      <Icon
                        color="grey"
                        name="exclamation triangle"
                        type="icon"
                      />
                      <strong>
                        <NumberFormat
                          value={props.packets_lost.total}
                          displayType={"text"}
                        />
                      </strong>
                    </React.Fragment>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </span>
        }
        position="bottom left"
      >
        <Popup.Header>Messages on the last 24 hours</Popup.Header>
        <Popup.Content>
          <Table compact="very" celled color="black" collapsing>
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
                  <Icon
                    color="green"
                    name="arrow alternate circle down"
                    type="icon"
                  />
                  Received
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <strong>
                    <NumberFormat
                      value={props.packets_down.total}
                      displayType={"text"}
                    />
                  </strong>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <strong>
                    <NumberFormat
                      value={props.packets_down.percentage}
                      displayType={"text"}
                      suffix={"%"}
                      decimalScale="2"
                    />
                  </strong>
                </Table.Cell>
                <Table.Cell rowSpan="4">
                  <Chart
                    options={data.options}
                    series={data.series}
                    type="pie"
                    width="150"
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Icon
                    color="orange"
                    name="arrow alternate circle up"
                    type="icon"
                  />
                  Sent
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <strong>
                    <NumberFormat
                      value={props.packets_up.total}
                      displayType={"text"}
                    />
                  </strong>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <strong>
                    <NumberFormat
                      value={props.packets_up.percentage}
                      displayType={"text"}
                      suffix={"%"}
                      decimalScale="2"
                    />
                  </strong>
                </Table.Cell>
              </Table.Row>
              {props.type == "device" && (
                <Table.Row>
                  <Table.Cell>
                    <Icon
                      color="grey"
                      name="exclamation triangle"
                      type="icon"
                    />
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
        </Popup.Content>
      </Popup>
    </span>
  );
};

export default ShowMessagesSummary;
