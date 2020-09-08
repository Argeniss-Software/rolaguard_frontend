import React, {useState} from "react";
import {Table, Label} from "semantic-ui-react";
import Moment from "react-moment";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";
import AlertUtil from "../../../util/alert-util"
import AssetLink from "../../utils/asset-link.component"
import DetailsAlertModal from "../../../components/details.alert.modal.component"

const ShowAlerts = (props) => {
    const colorsMap = AlertUtil.getColorsMap();
    const [selectedAlert, setSelectedAlert] = useState({alert: {}, alert_type: {}})
    
    const showAlertDetails = (data) => {
      setSelectedAlert({ alert: data, alert_type: data.type })
    }
    
    const closeAlertDetails = () => {
      setSelectedAlert({alert: {}, alert_type: {}})
    }
    
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
                <Table.HeaderCell collapsing>GATEWAY</Table.HeaderCell>
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
                    onClick={() => showAlertDetails(alert)}
                    collapsing
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
                  <Table.Cell onClick={() => showAlertDetails(alert)}>
                    {alert.type.name}
                  </Table.Cell>
                  <Table.Cell
                    singleLine
                    onClick={() => showAlertDetails(alert)}
                  >
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {alert.created_at}
                      </Moment>
                    }
                  </Table.Cell>

                  {!_.isEmpty(selectedAlert.alert) && (
                    <DetailsAlertModal
                      loading={false}
                      alert={selectedAlert}
                      onClose={closeAlertDetails}
                    />
                  )}
                  <Table.Cell
                    /*onClick={() => showAlertDetails(alert)}*/
                    className="upper"
                    style={{ maxWidth: "180px" }}
                    collapsing
                  >
                    <AssetLink
                      id={alert.gateway_id}
                      title={
                        alert.parameters.gateway +
                        (alert.parameters.gw_name
                          ? `(${alert.parameters.gw_name})`
                          : "")
                      }
                      type="gateway"
                    />
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