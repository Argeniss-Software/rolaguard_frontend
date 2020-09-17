import React, {useState, useEffect} from "react";
import { Button, Modal } from "semantic-ui-react";
import ShowDeviceState from "../utils/show-device-state.component"
import ShowDeviceIcon  from "../utils/show-device-icon.component";
import AssetIdComponent from "../utils/asset-id.component";
import PacketsGraph from "../utils/show-asset-info/packets-graph-component";
import _ from 'lodash'

const ModalResourceUsage = (props) => {
  const [open, setOpen] = useState(props.openModal || true);
  const closeModal = () => {
    if (_.isFunction(props.onClose)) {
      props.onClose()
    }
    setOpen(false)
  }
  return (
    <Modal
      centered={false}
      closeIcon
      open={open}
      onClose={() => closeModal()}
      onOpen={() => {
        setOpen(true);
      }}
      size="large"
    >
      <Modal.Header>
        <ShowDeviceState state={props.asset.connected} />
        &nbsp;&nbsp;&nbsp;
        <ShowDeviceIcon type={props.asset.type}></ShowDeviceIcon>
        &nbsp;
        {_.get(props, "asset.type")
          ? props.asset.type.toUpperCase() + ": "
          : ""}
        <AssetIdComponent
          type={props.asset.type}
          id={props.asset.id}
          hexId={props.asset.hex_id}
          showAsLink={false}
        />
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <PacketsGraph type={props.asset.type} id={props.asset.id} />
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={() => closeModal()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalResourceUsage;
