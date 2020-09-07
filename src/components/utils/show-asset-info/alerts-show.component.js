import * as React from "react";
import {Table, Popup, Label} from "semantic-ui-react";
import ImportanceLabel from "../../utils/importance-label.component";
import DeviceIdComponent from "../device-id.component"
import Moment from "react-moment";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";
import AlertUtil from "../../../util/alert-util"

const ShowAlerts = (props) => {
    const colorsMap = AlertUtil.getColorsMap();

    if (props.totalItems > 0) {
      return (
        <React.Fragment>
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
                <Table.HeaderCell>GATEWAY</Table.HeaderCell>
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
                    {_.get(alert, "type.risk") && (
                      <Label
                        horizontal
                        style={{
                          backgroundColor: colorsMap[alert.type.risk],
                          color: "white",
                          borderWidth: 1,
                          borderColor: colorsMap[alert.type.risk],
                          width: "100px",
                        }}
                      >
                        {alert.type.risk}
                      </Label>
                    )}
                  </Table.Cell>

                  <Table.Cell /*onClick={() => showAlertDetails(index)}*/>
                    {alert.type.name}
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
                    /*onClick={() => showAlertDetails(index)}*/
                    className="upper"
                    style={{ maxWidth: "180px" }}
                  >
                    {alert.parameters.gateway +
                      (alert.parameters.gw_name
                        ? `(${alert.parameters.gw_name})`
                        : "")}
                  </Table.Cell>
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