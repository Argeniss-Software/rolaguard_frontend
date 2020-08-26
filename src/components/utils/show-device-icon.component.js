/*
  This component show the icon depend if it is a device, gateway or unknown
  
  params:
    type: string, options: ['device', 'gateway', 'unknown']
*/

import React from "react";
import "./show-device-icon.component.css";

const getHandlerClick = (func) => {
  if (typeof func === "function") {
    return func
  } else {
    return undefined;
  }
}

function ShowDeviceIcon(props) {
  
  const type = props && props.type && props.type.toLowerCase().trim();
  const deviceTitle = "device"
  const gatewayTitle = "gateway";
  const unknown = "unknown";

  if (type === deviceTitle) {
    return <i onClick={getHandlerClick(props.clickHandler)} className="fas fa-microchip" title={deviceTitle} />;
  } else if (type === gatewayTitle) {
    return <i onClick={getHandlerClick(props.clickHandler)} className="fas fa-broadcast-tower" title={gatewayTitle} />;
  } else if (type === unknown) {
    return <i onClick={getHandlerClick(props.clickHandler)} className="fas fa-question" title={gatewayTitle} />;
  } else {
    return (
      <span onClick={getHandlerClick(props.clickHandler)} className="pointer">
        <i className="fas fa-broadcast-tower" title={gatewayTitle} />
        /
        <i className="fas fa-microchip" title={deviceTitle} />
      </span>
    );
  }
}

export default ShowDeviceIcon;

