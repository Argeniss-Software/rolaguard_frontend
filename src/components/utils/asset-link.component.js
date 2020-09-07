import * as React from "react";
import _ from "lodash"

const AssetLinkComponent = (props) => {

  const getLinkToDevice = (title, assetId, type = "device") => {
    const normalizedType = type && type.toLowerCase().trim()
    if (!_.isNull(assetId) && !_.isUndefined(assetId) && ['gateway', 'device'].includes(normalizedType)) {
      return <a href={`/dashboard/assets/${normalizedType}/${assetId}/view`}>{title}</a>
    } else {
      return title
    }
  }

  const { id, type, title } = props
  return getLinkToDevice(title, id, type)
}

export default AssetLinkComponent;