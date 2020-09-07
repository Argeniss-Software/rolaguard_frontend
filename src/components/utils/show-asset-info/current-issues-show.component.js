import * as React from "react";
import { Table, Label, Popup } from "semantic-ui-react";
import ImportanceLabel from "../../utils/importance-label.component";
import DeviceIdComponent from "../device-id.component";
import Moment from "react-moment";
import AlertUtil from "../../../util/alert-util";
import _ from "lodash";
import EmptyComponent from "../../utils/empty.component";

const ShowCurrentIssues = (props) => {
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
                  <Table.Cell /*onClick={() => this.showAlertDetails(index)}*/>
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
                  <Table.Cell /*onClick={() => this.showAlertDetails(index)}*/>
                    {current_issue.alert.type.name}
                  </Table.Cell>
                  <Table.Cell
                    singleLine
                    /*onClick={() => this.showAlertDetails(index)}*/
                  >
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {current_issue.since}
                      </Moment>
                    }
                  </Table.Cell>

                  <Table.Cell
                    singleLine
                    /*onClick={() => this.showAlertDetails(index)}*/
                  >
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {current_issue.last_checked}
                      </Moment>
                    }
                  </Table.Cell>
                  <Table.Cell
                    /*onClick={() => showAlertDetails(index)}*/
                    className="upper"
                  >
                    {current_issue.alert.parameters.gateway +
                      (current_issue.alert.parameters.gw_name
                        ? `(${current_issue.alert.parameters.gw_name})`
                        : "")}
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
