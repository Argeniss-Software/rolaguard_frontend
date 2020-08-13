import * as React from "react";
import { Popup } from "semantic-ui-react";

const AssetIdComponent = (props) => {
  const { id, type } = props;
  const normalizedType = type && type.toLowerCase().trim();

  const normalizedId = id ? id : "ID UNDEFINED";
  const deviceEUIText = "Device EUI";
  const deviceGatewayText = "Gateway ID";

  const popupContent =
    normalizedType === "device"
      ? deviceEUIText
      : normalizedType === "gateway"
      ? deviceGatewayText
      : "";

  if (normalizedType !== "unknown") {
    return (
      <Popup
        trigger={<span>{normalizedId}</span>}
        content={popupContent}
      ></Popup>
    );
  } else {
    return (
      <Popup
        trigger={<span>"Unknown identifier"</span>}
        content="Unknown identifier"
      ></Popup>
    );
  }
};

export default AssetIdComponent;
