import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import { Modal, Table, Button } from "semantic-ui-react";



import Tag from "../utils/tags/tag.component"
import TagSelector from "../utils/tags/tag.selector.component"

const AssignTagsModal = (props) => {

  /*
    props:
      open: boolean
      assets: list of all asset on the page (with selected parameter)
      onClose: function to run when closing modal
  */
 const { tagsStore } = React.useContext(MobXProviderContext);
 const [tagsToAssign, setTagsToAssign] = React.useState([]);


  const ShowTags = (props) => {
    console.log(tagsToAssign);
    return tagsToAssign.map((tag) => <Tag key={tag.id} removable={true} name={tag.name} id={tag.id} color={tag.color} onRemoveClick={() => handleTagRemoval(tag)} />)
  };

  const handleTagRemoval = (tag) => {
    setTagsToAssign((tags) => tags.filter((t) => tag.id !== t.id));
  }

  const handleTagSelected = (tag) => {
    setTagsToAssign((tags) => [...tags, tag]);
    console.log(tagsToAssign);
  }

  const handleAssign = () => {
    tagsToAssign.forEach((tag) => tagsStore.assignTagToDevices(tag, props.assets.filter((item) => item.selected)));
  }

  console.log(tagsToAssign);
  return(
    <Modal
    open={props.open} 
    >
      <Modal.Header>ASSIGN TAGS</Modal.Header>
      <Modal.Content>
        Tags to assign: <ShowTags tags={tagsToAssign}/> <TagSelector alreadyAssignTags={tagsToAssign} onSelection={handleTagSelected} />
        
        <strong>Devices affected:</strong>
        <div style={{maxHeight: 250, width: 500, overflowY: "scroll"}}>
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
        </div>
      </Modal.Content>
      <Modal.Actions>
          <Button
            onClick={() => props.onClose()}
            content="Close"
          />
          <Button
              type="submit"
              color="green"
              content="Create"
              onClick={handleAssign}
          />
        </Modal.Actions>
    </Modal>
  ); 
}

export default AssignTagsModal;