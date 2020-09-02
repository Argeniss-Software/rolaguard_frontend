import * as React from "react";
import {Table} from "semantic-ui-react";
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
              <Table.HeaderCell collapsing>ID/ADDRESS</Table.HeaderCell>
              <Table.HeaderCell collapsing>RISK</Table.HeaderCell>
              <Table.HeaderCell collapsing>IMPORTANCE</Table.HeaderCell>
              <Table.HeaderCell collapsing>DESCRIPTION</Table.HeaderCell>
              <Table.HeaderCell collapsing>DATE</Table.HeaderCell>
              <Table.HeaderCell collapsing>GATEWAY</Table.HeaderCell>
              <Table.HeaderCell collapsing>DATA SOURCE</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {props.alerts.map((alert) => (
              <Table.Row>
                <Table.Cell className="id-cell upper">
                  <DeviceIdComponent
                    parameters={alert.parameters}
                    alertType={alert.type}
                  />
                </Table.Cell>
                <Table.Cell>risk</Table.Cell>
                <Table.Cell>
                  <ImportanceLabel importance={alert.asset_importance} />{" "}
                </Table.Cell>
                <Table.Cell>description</Table.Cell>
                <Table.Cell singleLine>
                  {
                    <Moment format="YYYY-MM-DD HH:mm">
                      {alert.created_at}
                    </Moment>
                  }
                </Table.Cell>
                <Table.Cell className="upper">
                  {alert.parameters.gateway +
                    (alert.parameters.gw_name
                      ? `(${alert.parameters.gw_name})`
                      : "")}
                </Table.Cell>
                <Table.Cell>{alert.data_collector_name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </React.Fragment>
      )
    } else {
      return (<EmptyComponent emptyMessage="There are no alerts to show" />)
    }
  
}

export default ShowAlerts;