import * as React from "react";
import {Table, Popup, Label} from "semantic-ui-react";
import ImportanceLabel from "../../utils/importance-label.component";
import DeviceIdComponent from "../device-id.component"
import Moment from "react-moment";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";

const ShowAlerts = (props) => {
    if (props.totalItems > 0) {
      return (
        <React.Fragment>
          <div>
            <strong>Last 5 alerts:</strong>
          </div>
          <Table
            striped
            selectable
            className="animated fadeIn"
            basic="very"
            compact="very"
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>RISK</Table.HeaderCell>
                <Table.HeaderCell>DESCRIPTION</Table.HeaderCell>
                <Table.HeaderCell
                  collapsing
                  /*  sorted={
                    orderBy[0] === "created_at"
                      ? orderBy[1] === "ASC"
                        ? "ascending"
                        : "descending"
                      : null
                  }
                  onClick={() => this.handleSort("created_at")}*/
                >
                  DATE
                </Table.HeaderCell>
                <Table.HeaderCell collapsing>
                  DEVICE ID/ADDRESS
                </Table.HeaderCell>
                <Table.HeaderCell>DEVICE NAME</Table.HeaderCell>
                <Table.HeaderCell collapsing>
                  <Popup
                    trigger={
                      <span style={{ cursor: "pointer" }}>IMPORTANCE</span>
                    }
                  >
                    The importance value indicates the user-defined relevance of
                    the device into the organization. Can be set for each asset
                    in the Inventory section.
                  </Popup>
                </Table.HeaderCell>
                <Table.HeaderCell>GATEWAY</Table.HeaderCell>
                <Table.HeaderCell>DATA SOURCE</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {props.alerts.map((alert, index) => (
                <Table.Row
                  key={index}
                  style={{ cursor: "pointer" }}
                  positive={alert.resolved_at}
                >
                  <Table.Cell
                    /*onClick={() => showAlertDetails(index)}*/ collapsing
                  >
                    {console.log(alert)}
                  </Table.Cell>

                  <Table.Cell /*onClick={() => showAlertDetails(index)}*/>
                    {/*alert_types[alert.type].name*/}
                  </Table.Cell>
                  <Table.Cell
                    singleLine
                    /*onClick={() => showAlertDetails(index)}*/
                  >
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {alert.created_at}
                      </Moment>
                    }
                  </Table.Cell>
                  <Table.Cell
                    className="id-cell upper"
                    /*onClick={() => showAlertDetails(index)}*/
                  >
                    <DeviceIdComponent
                      parameters={alert.parameters}
                      alertType={alert.type}
                    />
                  </Table.Cell>
                  <Table.Cell /*onClick={() => showAlertDetails(index)}*/>
                    {alert.parameters.dev_name}
                  </Table.Cell>
                  <Table.Cell
                    /*onClick={() => showAlertDetails(index)}*/
                    collapsing
                  >
                    {" "}
                    <ImportanceLabel importance={alert.asset_importance} />{" "}
                  </Table.Cell>
                  <Table.Cell
                    /*onClick={() => showAlertDetails(index)}*/
                    className="upper"
                    style={{ maxWidth: "180px" }}
                  >
                    {alert.parameters.gateway +
                      (alert.parameters.gw_name
                        ? `(${alert.parameters.gw_name})`
                        : "")}
                  </Table.Cell>
                  <Table.Cell /*onClick={() => showAlertDetails(index)}*/>
                    {alert.data_collector_name}
                  </Table.Cell>
                  {/*
                <Table.Cell className="td-actions">
                  {!alert.resolved_at && (
                    <ResolveAlarmModal
                      alarm={{
                        alert: alert,
                        alert_type: alert_types[alert.type],
                      }}
                      handleAlertResolution={handleAlertResolution}
                    />
                  )}
                  {alert.resolved_at && (
                    <Popup
                      trigger={
                        <button onClick={() => showAlertDetails(index)}>
                          <i className="fas fa-eye" />
                        </button>
                      }
                      content="View alert"
                    />
                  )}
                </Table.Cell>
                    */}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </React.Fragment>
      );
    } else {
      return (<EmptyComponent emptyMessage="There are no alerts to show" />)
    }
  
}

export default ShowAlerts;