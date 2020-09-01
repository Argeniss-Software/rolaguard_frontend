import * as React from "react";
import {Icon, Popup} from "semantic-ui-react";

const ShowDeviceState = (props) => {
  const connectedState = true;
  const connectedText = 'transmitting';
  const disconnectedText = 'not transmitting';

  const statusText = props.state && props.state === connectedState ? connectedText : disconnectedText;
  const colorStatus = props.state && props.state === connectedState ? "green" : "red";

  if (props.showPopup) {
    return (
      <Popup trigger={<Icon color={colorStatus} name="circle" />}>
        <Popup.Header>Asset Status</Popup.Header>
        <Popup.Content>
          <Icon color={colorStatus} name="circle" /> {statusText}
        </Popup.Content>
      </Popup>
    );
  } else {
    if (props.showLabel) {
      return (
        <React.Fragment>
          <Icon color={colorStatus} name="circle" />
          <strong>{statusText.toUpperCase()}</strong>
        </React.Fragment>
      );
    } else {
      return <Icon color={colorStatus} name="circle" />
    }
    
  }
};

export default ShowDeviceState;
