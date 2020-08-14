import * as React from "react";
import {Icon, Popup} from "semantic-ui-react";

const ShowDeviceState = (state) => {
  const connectedState = "connected";
  const dissconectedState = "disconnected";

  const statusText =
    state && state.trim().toLowerCase() === connectedState
      ? connectedState
      : dissconectedState;
  const colorStatus = statusText === connectedState ? "green" : "red";

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
