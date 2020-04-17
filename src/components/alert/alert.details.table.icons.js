import React, { Component } from "react";
import { Popup, Table } from "semantic-ui-react";

import gatewaySvg from '../../img/gateway.svg'
import microchipSvg from '../../img/microchip.svg'
import "./alert.details.table.icons.css";

class AlertDetailTableIcon extends Component {

    constructor(props){
        super(props);
        this.state = {
            gatewayUrl: gatewaySvg,
            microchipUrl: microchipSvg
        }
    }

    getGatewayPopup(icon, value, text, type) {
        return (
            <Popup trigger={
                <div>
                    {/* <i className={"icon-font-size-" + type +" fas " + icon} /> */}
                    <img id="gateway-logo" className="animated" src={this.state.gatewayUrl} alt=""/>
                </div>
                } flowing hoverable>
                <div>
                    {text + ":"}  {value.toUpperCase()}
                </div>
            </Popup>
        );
    }

    getDevicePopup(dev_eui, dev_addr, device_name, type) {
        return (
            <Popup trigger={
                <div>
                    <img id="device-logo" className="animated" src={this.state.microchipUrl} alt=""/>
                </div>
                } flowing hoverable>
                <div className="device-popup">
                    <span className={device_name ? "" : "hide"}>{device_name ? "DEVICE NAME: " + device_name.toUpperCase() : ""}</span>
                    <span className={dev_eui ? "" : "hide"}>{dev_eui ? "DEV EUI: " + dev_eui.toUpperCase() : ""}</span>
                    <span className={dev_addr ? "" : "hide"}>{dev_addr ? "DEV ADDR: " + dev_addr.toUpperCase() : ""}</span>
                </div>
            </Popup>
        );
    }

    getIconDescription(value) {
        return (
            <span className="icon-description">{value ? value.toUpperCase() : ""}</span>
        );
    }

    render(){
        const {dev_eui, gateway, device_name, dev_addr} = this.props.parameters;
        return (
        <div className="div-container">
            <Table compact="very" basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign="center" className={dev_eui ? "" : "hide"}>
                        {dev_eui && this.getDevicePopup(dev_eui, dev_addr, device_name, "device")}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" className={gateway && dev_eui ? "" : "hide"}>
                        <i className="fas fa-ellipsis-h icon-font-arrows-h" ></i>
                        <i className="fas fa-ellipsis-h icon-font-arrows-h" ></i>
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" className={gateway ? "" : "hide"}>
                        {gateway && this.getGatewayPopup("fa-wifi", gateway, "GATEWAY ID", "gateway")}
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                <Table.Cell className={dev_eui ? "" : "hide"}>
                    {this.getIconDescription(dev_eui)}
                </Table.Cell>
                <Table.Cell  className={gateway && dev_eui ? "" : "hide"}></Table.Cell>
                <Table.Cell className={gateway ? "" : "hide"}>
                    {this.getIconDescription(gateway)}
                </Table.Cell>
                </Table.Row>
            </Table.Body>
            </Table>
        </div>
        ); 
    }
}

export default AlertDetailTableIcon;
