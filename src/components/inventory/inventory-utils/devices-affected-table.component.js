import * as React from "react";
import {Table} from "semantic-ui-react"
import _ from 'lodash'
import "./devices-affected-table.component.css"


const DevicesTable = (props) => {

  /*
    props:
      - assets: assets list to show (only shows those with selected = true)  
  */

  return (
    <div id="affected-devices-table-container">
      <Table striped selectable scrollable className="animated fadeIn scrollable content" basic="very" compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>NAME</Table.HeaderCell>
            <Table.HeaderCell>VENDOR</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
          <Table.Body className="affected-devices-body-container">
            {props.assets.filter((i) => i.selected).map((item, index) => 
              <Table.Row key={index}>
                <Table.Cell>{_.toUpper(item.hex_id)}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.vendor}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
      </Table>
    </div>
  );
}

export default DevicesTable;