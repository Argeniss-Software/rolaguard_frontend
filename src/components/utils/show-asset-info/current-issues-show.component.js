import * as React from "react";
import { Table, Label } from "semantic-ui-react";
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
        <div>
          <strong>Last 5 current issues:</strong>
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
              <Table.HeaderCell collapsing>DEVICE NAME</Table.HeaderCell>
              <Table.HeaderCell collapsing>RISK</Table.HeaderCell>
              <Table.HeaderCell collapsing>IMPORTANCE</Table.HeaderCell>
              <Table.HeaderCell>DESCRIPTION</Table.HeaderCell>
              <Table.HeaderCell collapsing>DATE</Table.HeaderCell>
              <Table.HeaderCell collapsing>LAST CHECKED</Table.HeaderCell>
              <Table.HeaderCell collapsing>GATEWAY</Table.HeaderCell>
              <Table.HeaderCell collapsing>DATA SOURCE</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.currentIssues.issues.map((item, index) => {
              return (
                <Table.Row key={index} style={{ cursor: "pointer" }}>
                  <Table.Cell className="id-cell upper">
                    <DeviceIdComponent
                      parameters={item.alert.parameters}
                      alertType={alert.type}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.alert.parameters.dev_name}</Table.Cell>
                  <Table.Cell>
                    <Label
                      horizontal
                      style={{
                        backgroundColor: AlertUtil.getColorsMap()[
                          item.alert_type.risk
                        ],
                        color: "white",
                        borderWidth: 1,
                        width: "100px",
                      }}
                    >
                      {item.alert_type.risk}
                    </Label>
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <ImportanceLabel
                      importance={item.alert.asset_importance}
                    />{" "}
                  </Table.Cell>
                  <Table.Cell>{item.alert_type.name}</Table.Cell>
                  <Table.Cell singleLine>
                    {<Moment format="YYYY-MM-DD HH:mm">{item.since}</Moment>}
                  </Table.Cell>
                  <Table.Cell singleLine>
                    {
                      <Moment format="YYYY-MM-DD HH:mm">
                        {item.last_checked}
                      </Moment>
                    }
                  </Table.Cell>
                  <Table.Cell className="upper">
                    {item.alert.parameters.gateway +
                      (item.alert.parameters.gw_name
                        ? `(${item.alert.parameters.gw_name})`
                        : "")}
                  </Table.Cell>
                  <Table.Cell>{item.data_collector_name}</Table.Cell>
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
