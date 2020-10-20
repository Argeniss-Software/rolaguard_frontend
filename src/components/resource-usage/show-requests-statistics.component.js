import * as React from "react";
import { Table } from "semantic-ui-react";

const ShowRequestsStatistics = (props) => {
  return (
    <Table basic compact celled>
      <Table.Body>
        <Table.Row warning>
          <Table.Cell collapsing>Retransmissions:</Table.Cell>
          <Table.Cell collapsing className="bold" textAlign="center">
            {props.asset.retransmissions}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Join requests:</Table.Cell>
          <Table.Cell collapsing className="bold" textAlign="center">
            {props.asset.join_requests}
          </Table.Cell>
        </Table.Row>
        <Table.Row negative>
          <Table.Cell collapsing>Failed Join Requests:</Table.Cell>
          <Table.Cell collapsing className="bold" textAlign="center">
            {props.asset.failed_join_requests}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
export default ShowRequestsStatistics;
