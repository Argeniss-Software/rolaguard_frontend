import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import { Modal, Button, Divider, Message } from "semantic-ui-react";

import "./inventory.assign-tags.modal.component.css";

import * as HttpStatus from "http-status-codes";
import DevicesTable from "./inventory-utils/devices-affected-table.component";
import ImportanceLabel from "../utils/importance-label.component";

const SetImportanceModal = (props) => {
  /*
    props:
      open: boolean
      assets: list of all asset on the page (selected parameter inside each item)
      onClose: function to run when closing modal
      onSuccess: funtion to run after the importance was set to all devices affected
  */

  const { inventoryAssetsStore } = React.useContext(MobXProviderContext);
  const [open, setOpen] = React.useState(!!props.open);
  const [importanceSelected, setImportance] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);
  const [sendDisabled, setSendDisabled] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const possibleImportances = ["LOW", "MEDIUM", "HIGH"];

  const ImportanceSelector = (props) => {
    return possibleImportances.map((i) => (
      <span
        style={{
          cursor: "pointer",
          opacity: i === importanceSelected ? "1" : "0.3",
        }}
        onClick={() => {
          setImportance(i);
          setSendDisabled(false);
        }}
      >
        <ImportanceLabel importance={i} />
      </span>
    ));
  };

  const postImportance = () => {
    setAssigning(true);
    console.log(inventoryAssetsStore);
    console.log(inventoryAssetsStore.getVendorsCount);
    inventoryAssetsStore.setImportance(importanceSelected, props.assets.filter((asset) => asset.selected))
      .then((response) => {
          if(response.status === HttpStatus.OK) {
            setAssigning(false);
            props.onSuccess();
          } else {
            setAssigning(false);
            setHasError(true);
          }
        }
      )
      .catch(() => {
          setAssigning(false);
          setHasError(true);
        }
      );
  };

  return (
    <Modal open={open}>
      <Modal.Header>SET DEVICES IMPORTANCE</Modal.Header>
      <Modal.Content className="modal-content-container">
        {hasError &&
          <Message error header='Oops!' content={'Something went wrong. Try again later.'} style={{maxWidth: '100%'}} className="animated fadeIn"/>
        }
        <strong>
          IMPORTANCE: <ImportanceSelector />
        </strong>
        <Divider />
        <strong>GATEWAYS/DEVICES SELECTED:</strong>
        <div className="table-wrapper">
          <DevicesTable assets={props.assets} />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => props.onClose()} content="Close" />
        <Button
          type="submit"
          disabled={sendDisabled}
          loading={assigning}
          color="green"
          content="Assign"
          onClick={postImportance}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default SetImportanceModal;
