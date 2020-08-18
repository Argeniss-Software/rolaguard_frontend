import * as React from "react";
import {Icon, Popup} from "semantic-ui-react";

const ShowDeviceState = (props) => {
  const connectedState = true;
  const connectedText = 'connected';
  const disconnectedText = 'disconnected';

  const statusText = props.state && props.state === connectedState ? connectedText : disconnectedText;
  const colorStatus = props.state && props.state === connectedState ? "green" : "red";

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
