import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import { Modal, Button, Message, Divider } from "semantic-ui-react";

import "./inventory.assign-tags.modal.component.css"

import Tag from "../utils/tags/tag.component"
import TagSelector from "../utils/tags/tag.selector.component"
import DevicesTable from "./inventory-utils/devices-affected-table.component"


const AssignTagsModal = (props) => {

  /*
    props:
      open: boolean
      assets: list of all asset on the page (with selected parameter)
      onClose: function to run when closing modal

      This component will assign the tags to all selected devices by itself
  */

 const { tagsStore } = React.useContext(MobXProviderContext);
 const [open, setOpen] = React.useState(!!props.open);
 const [tagsToAssign, setTagsToAssign] = React.useState([]);
 const [assigning, setAssigning] = React.useState(false);
 const [sendDisabled, setSendDisabled] = React.useState(true);
 const [showError, setShowError] = React.useState(false);


  const ShowTags = (props) => {
    return tagsToAssign.map((tag) => <Tag key={tag.id} removable={true} name={tag.name} id={tag.id} color={tag.color} onRemoveClick={() => handleTagRemoval(tag)} />)
  };

  const handleTagRemoval = (tag) => {
    setTagsToAssign((tags) => tags.filter((t) => tag.id !== t.id));
    setSendDisabled(!tagsToAssign && props.assets.some((item) => item.selected));
  }

  const handleTagSelected = (tag) => {
    setTagsToAssign((tags) => [...tags, tag]);
    setSendDisabled(!tagsToAssign && props.assets.some((item) => item.selected));
  }

  const handleAssign = () => {
    setAssigning(true)
    const tagsAssignPromise = tagsToAssign.map((tag) => tagsStore.assignTagToDevices(tag, props.assets.filter((item) => item.selected)));

    Promise.all(tagsAssignPromise)
      .then(
        (responses) => { 
          if(responses.every((response) => response.status === 200)){
            setAssigning(false)
            if (props.onSuccess instanceof Function) props.onSuccess();
          }
          else {
            setAssigning(false);
            setShowError(true);
          }
        }
      )
      .catch(
        () => {
          setAssigning(false);
          setShowError(true);
        }
      );
  }


  return(
    <Modal
    open={open} 
    >
      <Modal.Header>ASSIGN TAGS</Modal.Header>
      <Modal.Content className="modal-content-container">
        {/* Error message in case the assignation fails */}
        {showError &&
          <div className="error-message-wrapper">
            <Message error header='Error' content="Something went wrong. Try again later." className="error-message" onClick={() => setShowError(false)}/>
          </div>
        }

        <strong>Tags to assign: </strong><ShowTags tags={tagsToAssign}/> <TagSelector alreadyAssignTags={tagsToAssign} onSelection={handleTagSelected} />
        <Divider/>
        <p><strong>Devices affected:</strong></p>
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