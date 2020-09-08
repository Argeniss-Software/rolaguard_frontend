import React, {useState} from "react";
import { Table, Label, Popup } from "semantic-ui-react";
import ImportanceLabel from "../../utils/importance-label.component";
import DeviceIdComponent from "../device-id.component";
import Moment from "react-moment";
import AlertUtil from "../../../util/alert-util";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";
import AssetLink from "../../utils/asset-link.component";
import DetailsAlertModal from "../../../components/details.alert.modal.component";

const ShowCurrentIssues = (props) => {
    const [selectedAlert, setSelectedAlert] = useState({alert: {}, alert_type: {}})
    
    const showAlertDetails = (data) => {
      setSelectedAlert({ alert: data.alert, alert_type: data.alert.type })
    }
    
    const closeAlertDetails = () => {
      setSelectedAlert({alert: {}, alert_type: {}})
    }

  if (props.currentIssues.total_items > 0) {
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
              <Table.HeaderCell collapsing>DATE</Table.HeaderCell>
              <Table.HeaderCell collapsing>LAST CHECKED</Table.HeaderCell>
              <Table.HeaderCell collapsing>GATEWAY</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.currentIssues.issues.map((current_issue, index) => {
              return (
                <Table.Row key={index} style={{ cursor: "pointer" }}>
                  <Table.Cell onClick={() => showAlertDetails(current_issue)}>
                    <Label
                      horizontal
                      style={{
                        backgroundColor: AlertUtil.getColorsMap()[
                          current_issue.alert.type.risk
                        ],
                        color: "white",
                        borderWidth: 1,
                        width: "100px",
                      }}
                    >
                      {current_issue.alert.type.risk}
                    </Label>
                  </Table.Cell>
                  <Table.Cell onClick={() => showAlertDetails(current_issue)}>
                    {current_issue.alert.type.name}
                  </Table.Cell>
                  <Table.Cell
                    singleLine
                    onClick={() => showAlertDetails(current_issue)}
                  >
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {current_issue.since}
                      </Moment>
                    }
                  </Table.Cell>

                  <Table.Cell
                    singleLine
                    onClick={() => showAlertDetails(current_issue)}
                  >
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {current_issue.last_checked}
                      </Moment>
                    }
                  </Table.Cell>
                  <Table.Cell
                    /*onClick={() => showAlertDetails(current_issue)}*/
                    className="upper"
                    style={{ maxWidth: "180px" }}
                    collapsing
                  >
                    <AssetLink
                      id={current_issue.alert.gateway_id}
                      title={
                        current_issue.alert.parameters.gateway +
                        (current_issue.alert.parameters.gw_name
                          ? `(${current_issue.alert.parameters.gw_name})`
                          : "")
                      }
                      type="gateway"
                    />
                    {!_.isEmpty(selectedAlert.alert) && (
                      <DetailsAlertModal
                        loading={false}
                        alert={selectedAlert}
                        onClose={closeAlertDetails}
                      />
                    )}                    
                  </Table.Cell>
                </Table.Row>
              );
            })}          
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  } else {
    return <EmptyComponent emptyMessage="There are no current issues to show" />;
  }
};

export default ShowCurrentIssues;
