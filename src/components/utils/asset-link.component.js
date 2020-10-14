import React from "react";
import _ from "lodash";
import "./asset-link.component.css";

const AssetLinkComponent = (props) => {
  const { title, id, type } = props;
  const assetType = type ? type : "device";
  const normalizedType = assetType && assetType.toLowerCase().trim();
  if (
    !_.isNull(id) &&
    !_.isUndefined(id) &&
    ["gateway", "device"].includes(normalizedType)
  ) {
    return (
      <React.Fragment>
        <a
          className="hover-underline"
          target="_blank"
          href={`/dashboard/assets/${normalizedType}/${id}/view`}
          rel="noopener noreferrer"
        >
          {title}
        </a>
      </React.Fragment>
    );
  } else {
    return title;
  }
};

export default AssetLinkComponent;
