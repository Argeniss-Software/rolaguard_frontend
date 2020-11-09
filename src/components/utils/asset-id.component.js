import * as React from "react";
import { Popup } from "semantic-ui-react";
import AssetLink from '../utils/asset-link.component'
import Highlighter from "react-highlight-words";

const AssetIdComponent = (props) => {
  const { id, type, hexId, showAsLink, highlightSearchValue } = props;
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
            {showLink && (
              <AssetLink
                title={normalizedHexId}
                id={id}
                type={normalizedType}
              />
            )}

            {!showLink &&
              (highlightSearchValue ? (
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[highlightSearchValue]}
                  autoEscape={true}
                  textToHighlight={normalizedHexId}
                />
              ) : (
                normalizedHexId
              ))}
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