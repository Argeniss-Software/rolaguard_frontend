import * as React from "react";
import { Popup } from "semantic-ui-react";
import AlertUtil from '../../util/alert-util';
import AssetLink from '../utils/asset-link.component'

class DeviceIdComponent extends React.Component {
  getPopup(text, textDescription, styleClass) {
    return (
      <Popup
        trigger={
          <span>
            <i className={styleClass} /> {text}
          </span>
        }
        content={textDescription}
      />
    );
  }
  getLinkToDevice(name, deviceId, type = "device") {
    return <AssetLink title={name} id={deviceId} type={type}/>
  }

  render() {
    const { parameters, alertType, deviceId} = this.props;
    const showNotAplicable = AlertUtil.alertTypes.notAplicableDescription.includes(
      alertType
    );
    const notApplicableText = "Not Applicable";

    if (
      parameters &&
      parameters.dev_eui &&
      parameters.dev_eui.trim &&
      parameters.dev_eui.trim() !== "" &&
      parameters.dev_eui.toLowerCase() !== "unknown"
    ) {
      return this.getPopup(
        showNotAplicable
          ? "N/A"
          : this.getLinkToDevice(parameters.dev_eui, deviceId),
        showNotAplicable ? notApplicableText : "Device EUI",
        showNotAplicable ? "" : "fas fa-fingerprint"
      );
    }

    if (
      parameters &&
      parameters.dev_addr &&
      parameters.dev_addr.trim &&
      parameters.dev_addr.trim() !== "" &&
      parameters.dev_addr.toLowerCase() !== "unknown"
    ) {
      return this.getPopup(
        showNotAplicable
          ? "N/A"
          : this.getLinkToDevice(parameters.dev_addr, deviceId),
        showNotAplicable ? notApplicableText : "Device Address",
        showNotAplicable ? "" : "fas fa-at"
      );
    }

    return this.getPopup(
      showNotAplicable ? "N/A" : "Unknown identifier",
      showNotAplicable ? notApplicableText : "Unknown identifier",
      showNotAplicable ? "" : "fas fa-question"
    );
  }
}

export default DeviceIdComponent;
