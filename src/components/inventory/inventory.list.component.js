import * as React from "react";
import Moment from "react-moment";
import { Table, Label, Popup } from "semantic-ui-react";
import "./inventory.list.component.css";
// import AlertUtil from '../util/alert-util';
import EmptyComponent from "../utils/empty.component";
// import ResolveAlarmModal from "./resolve.alarm.modal.component";
import InventoryIdComponent from "./utils/inventory-id.component";

class InventoryListComponent extends React.Component {

//   colorsMap = AlertUtil.getColorsMap();

  constructor(props) {
    super(props);
  }

  render() {
    // const {alerts, alert_types, handleAlertResolution, showAlertDetails} = this.props
    const {inventory_assets} = this.props
    
    if(!alerts || alerts.length === 0) {
      return (
        <Table.Row>
          <Table.Cell colSpan='6'>
            <EmptyComponent emptyMessage="No items found" />
          </Table.Cell>
        </Table.Row>
      );
    } else {
      
      return (
        alerts.map((alert, index) => {
          return (
              <Table.Row key={index} style={{cursor: 'pointer'}} positive={alert.resolved_at}>
                <Table.Cell className="id-cell upper" onClick={() => showAlertDetails(index)}>
                  <DeviceIdComponent parameters={alert.parameters} alertType={alert.type}/>
                </Table.Cell>
                <Table.Cell onClick={() => showAlertDetails(index)}>
                  <Label horizontal style={{backgroundColor: this.colorsMap[ alert_types[alert.type].risk ], color: 'white', borderWidth: 1, borderColor: this.colorsMap[ alert_types[alert.type].risk ], width: '100px'}}>{alert_types[alert.type].risk}</Label>
                </Table.Cell>
                <Table.Cell onClick={() => showAlertDetails(index)}>
                  {alert_types[alert.type].name}
                </Table.Cell>
                <Table.Cell singleLine onClick={() => showAlertDetails(index)}>{<Moment format="YYYY-MM-DD HH:mm">{alert.created_at}</Moment>}</Table.Cell>
                <Table.Cell onClick={() => showAlertDetails(index)} className="upper">{alert.parameters.gateway}</Table.Cell>
                <Table.Cell onClick={() => showAlertDetails(index)}>{alert.data_collector_name}</Table.Cell>
                <Table.Cell className="td-actions">
                  {
                    !alert.resolved_at && 
                    <ResolveAlarmModal alarm={{ alert: alert, alert_type: alert_types[alert.type] }} handleAlertResolution={handleAlertResolution}/>
                  }
                  {
                    alert.resolved_at && 
                    <Popup
                      trigger={
                        <button onClick={() => showAlertDetails(index)}>
                          <i className="fas fa-eye" />
                        </button>
                      }
                      content="View alert"
                    />
                  }
                </Table.Cell>
              </Table.Row>
          );
        })
      )
    }
  }
}

export default InventoryListComponent;
