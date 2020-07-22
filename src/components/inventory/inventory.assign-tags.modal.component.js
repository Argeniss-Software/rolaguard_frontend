import * as React from "react";
import { Modal, Table, Button } from "semantic-ui-react";

import Tag from "../utils/tags/tag.component"

const AssignTagsModal = (props) => {

  /*
    props:
      open: boolean
      assets: list of all asset on the page (with selected parameter)
      onClose: function to run when closing modal
  */

  const [tagsToAssign, setTagsToAssign] = React.useState([]);

  const showTags = (tags) => {
    tags.map((tag) => <Tag removable={true} name={tag.name} id={tag.id} color={tag.color} />)
  };

  return(
    <Modal
    open={props.open} 
    >
      <Modal.Header>ASSIGN TAGS</Modal.Header>
      <Modal.Content>
        Tags to assign: {showTags()}
        Devices affected:
        <Table striped selectable className="animated fadeIn" basic="very" compact="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>NAME</Table.HeaderCell>
              <Table.HeaderCell>VENDOR</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.assets.filter((i) => i.selected).map((item, index) => 
              <Table.Row key={index}>
                <Table.Cell>{item.hex_id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.vendor}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
          <Button
            onClick={() => props.onClose()}
            content="Close"
          />
        </Modal.Actions>
    </Modal>
  ); 
}

export default AssignTagsModal;