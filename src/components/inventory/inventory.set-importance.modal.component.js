import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import { Modal, Table, Button } from "semantic-ui-react";

import "./inventory.assign-tags.modal.component.css"

import Tag from "../utils/tags/tag.component"
import TagSelector from "../utils/tags/tag.selector.component"
import DevicesTable from "./inventory-utils/devices-affected-table.component"

const SetImoprtanceModal = (props) => {

  /*
    props:
      open: boolean
      assets: list of all asset on the page (selected parameter inside each item)
      onClose: function to run when closing modal
  */

 const { tagsStore } = React.useContext(MobXProviderContext);
 const [open, setOpen] = React.useState(!!props.open);
 const [tagsToAssign, setTagsToAssign] = React.useState([]);
 const [assigning, setAssigning] = React.useState(false);
 const [sendDisabled, setSendDisabled] = React.useState(true);


  const ShowTags = (props) => {
    console.log(tagsToAssign);
    return tagsToAssign.map((tag) => <Tag key={tag.id} removable={true} name={tag.name} id={tag.id} color={tag.color} onRemoveClick={() => handleTagRemoval(tag)} />)
  };

  const handleTagRemoval = (tag) => {
    setTagsToAssign((tags) => tags.filter((t) => tag.id !== t.id));
    setSendDisabled((tagsToAssign.length > 0) && props.assets.some((item) => item.selected))
  }

  const handleTagSelected = (tag) => {
    setTagsToAssign((tags) => [...tags, tag]);
    setSendDisabled((tagsToAssign.length > 0) && props.assets.some((item) => item.selected))
  }

  const handleAssign = () => {
    setAssigning(true)
    const tagsAssignPromise = tagsToAssign.map((tag) => tagsStore.assignTagToDevices(tag, props.assets.filter((item) => item.selected)));

    Promise.all(tagsAssignPromise).then(() => {
      setAssigning(false)
      props.onClose();
    }
    );
  }

  console.log(tagsToAssign);
  return(
    <Modal
    open={open}
    >
      <Modal.Header>SET DEVICES IMPORTANCE</Modal.Header>
      <Modal.Content className="modal-content-container">
        <strong>IMPORTANCE: </strong>
        
        <strong>DEVICES AFFECTED:</strong>
        <div className="table-wrapper">
          <DevicesTable assets={props.assets} />
        </div>
      </Modal.Content>
      <Modal.Actions>
          <Button
            onClick={() => props.onClose()}
            content="Close"
          />
          <Button
              type="submit"
              disabled={sendDisabled}
              loading={assigning}
              color="green"
              content="Assign"
              onClick={handleAssign}
          />
        </Modal.Actions>
    </Modal>
  ); 
}

export default AssignTagsModal;