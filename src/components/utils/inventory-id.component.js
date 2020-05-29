import * as React from "react";
import { Popup } from "semantic-ui-react";
import AlertUtil from '../../util/alert-util';

class InventoryIdComponent extends React.Component {

    getPopup(text, textDescription, styleClass) {
      return (
        <Popup
            trigger={
              <span><i className={styleClass}/> {text}</span>
            }
            content={textDescription}
          />
        );
    }

    render() {
        const { parameters, alertType } = this.props
        const showNotAplicable = AlertUtil.alertTypes.notAplicableDescription.includes(alertType);
        const notApplicableText = "Not Applicable";

        if (parameters && parameters.dev_eui && parameters.dev_eui.trim && parameters.dev_eui.trim() !== '' && parameters.dev_eui.toLowerCase() !== 'unknown') {
            return this.getPopup(showNotAplicable? "N/A" : parameters.dev_eui, showNotAplicable? notApplicableText : "Device EUI", showNotAplicable ? "" : "fas fa-fingerprint");
        }
      
        if (parameters && parameters.dev_addr && parameters.dev_addr.trim && parameters.dev_addr.trim() !== '' && parameters.dev_addr.toLowerCase() !== 'unknown') {
          return this.getPopup(showNotAplicable? "N/A" : parameters.dev_addr, showNotAplicable? notApplicableText : "Device Address", showNotAplicable ? "" : "fas fa-at");
        }
      
        return this.getPopup(showNotAplicable? "N/A" : "Unknown identifier", showNotAplicable? notApplicableText : "Unknown identifier", showNotAplicable ? "" : "fas fa-question");
    }
}

export default InventoryIdComponent;
