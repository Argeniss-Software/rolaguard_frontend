/*
  This component show the icon depend if it is a device, gateway or unknown
  
  params:
    type: string, options: ['device', 'gateway', 'unknown']
*/

import React from "react";

function ShowDeviceIcon(props) {
  debugger
  const type = props && props.type && props.type.toLowerCase().trim();
  if (type === "device") {
    return <i className="fas fa-microchip" />;
  } else if (type === "gateway") {
    return <i className="fas fa-broadcast-tower" />;
  } else {
    return (
      <span>
        <i className="fas fa-broadcast-tower" />/
        <i className="fas fa-microchip" />
      </span>
    );

  }
}

export default ShowDeviceIcon;
