import React from "react";
import { Button, Modal, Popup } from "semantic-ui-react";
import ShowAssetInfo from "../utils/show-asset-info/show-asset-info.component"

const ModalResourceUsage = (props) => {
  const [open, setOpen] = React.useState(false);
  const [doRequest, setDoRequest] = React.useState(false);

  return (
    <Modal
      centered={false}
      closeIcon
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
        setDoRequest(true);
      }}
      size="large"
      trigger={
            <button>
              <i className="fas fa-eye" />
            </button>
      }
    >
      <Modal.Content>
        <Modal.Description>
          <ShowAssetInfo
            defaultActiveIndex="0"
            id={props.id}
            type={props.type}
            asset={props.asset}
            doRequest={doRequest}
          ></ShowAssetInfo>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalResourceUsage;
