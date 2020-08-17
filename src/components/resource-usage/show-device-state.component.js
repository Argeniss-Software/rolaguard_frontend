import * as React from "react";
import {Icon, Popup} from "semantic-ui-react";

const ShowDeviceState = (state) => {
  const connectedState = true;
  const dissconectedState = false;
  const connectedText = 'connected';
  const disconnectedText = 'disconnected';

  const statusText = state && state === connectedState ? connectedText : disconnectedText;
  const colorStatus = state && state === connectedState ? "green" : "red";

  return (
    <Popup trigger={<Icon color={colorStatus} name="circle" />}>
      <Popup.Header>Asset Status</Popup.Header>
      <Popup.Content>
        <Icon color={colorStatus} name="circle" /> {statusText}
      </Popup.Content>
    </Popup>
  );
};

export default ShowDeviceState;
