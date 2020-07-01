import * as React from "react";
import { Popup } from "semantic-ui-react";
import AlertUtil from '../../util/alert-util';

class InventoryIdComponent extends React.Component {

    getPopup(text, textDescription) {
      return (
        <Popup
            trigger={
              <span>{text}</span>
            }
            content={textDescription}
          />
        );
    }

    render() {
        const { id, type  } = this.props

        if (type && type.toLowerCase().trim() === 'device' && type.toLowerCase() !== 'unknown') {
            return this.getPopup(id? id : 'ID UNDEFINED' , "Device EUI");
        }
        if (type && type.toLowerCase().trim() === 'gateway' && type.toLowerCase() !== 'unknown') {
          return this.getPopup(id? id : 'ID UNDEFINED', "Gateway ID");
        }
      
        return this.getPopup("Unknown identifier", "Unknown identifier");
    }
}

export default InventoryIdComponent;
