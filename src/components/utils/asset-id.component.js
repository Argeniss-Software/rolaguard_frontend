import * as React from "react";
import { Popup } from "semantic-ui-react";

const AssetIdComponent = (props) => {
  const { id, type, hexId, showAsLink } = props;
  const normalizedType = type && type.toLowerCase().trim();

  const normalizedHexId = hexId ? hexId.toUpperCase() : "ID UNDEFINED";
  const deviceEUIText = "Device EUI";
  const deviceGatewayText = "Gateway ID";
  const showLink = showAsLink === undefined ? true : showAsLink

  const popupContent =
    normalizedType === "device"
      ? deviceEUIText
      : normalizedType === "gateway"
      ? deviceGatewayText
      : "";

  if (normalizedType !== "unknown") {
    return (
      <Popup
        trigger={
          <span>
            {showLink && 
              <a href={`/dashboard/assets/${normalizedType}/${id}/view`}>
                {normalizedHexId}
              </a>
            }
            {!showLink && normalizedHexId}          
          </span>
        }
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