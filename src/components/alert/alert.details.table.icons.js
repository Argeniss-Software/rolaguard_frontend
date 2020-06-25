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

    getGatewayPopup(gw_name, gateway, gw_vendor) {
        return (
            <Popup trigger={
                <div>
                    <img id="gateway-logo" className="animated" src={this.state.gatewayUrl} alt=""/>
                    </div>
                }
                
                flowing hoverable
                position='bottom center'
            >
                <div className="device-popup">
                    <span className={gw_name ? "" : "hide"}>{gw_name ? "GW NAME: " + gw_name : ""}</span>
                    <span className={gateway ? "" : "hide"}>{gateway ? "GW ID: " + gateway.toUpperCase() : ""}</span>
                    <span className={gw_vendor ? "" : "hide"}>{gw_vendor ? "GW VENDOR: " + gw_vendor : ""}</span>
                </div>
            </Popup>
        );
    }

    getDevicePopup(dev_eui, dev_addr, device_name, dev_vendor) {
        return (
            <Popup trigger={
                <div>
                    <img id="device-logo" className="animated" src={this.state.microchipUrl} alt=""/>
                </div>
                }
                flowing hoverable
                position='bottom center'
            >
                <div className="device-popup">
                    <span className={device_name ? "" : "hide"}>{device_name ? "DEV NAME: " + device_name : ""}</span>
                    <span className={dev_eui ? "" : "hide"}>{dev_eui ? "DEV EUI: " + dev_eui.toUpperCase() : ""}</span>
                    <span className={dev_addr ? "" : "hide"}>{dev_addr ? "DEV ADDR: " + dev_addr.toUpperCase() : ""}</span>
                    <span className={dev_vendor ? "" : "hide"}>{dev_vendor ? "DEV VENDOR: " + dev_vendor : ""}</span>
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
        const {dev_eui, dev_addr, dev_name, dev_vendor, gateway, gw_name, gw_vendor} = this.props.parameters;

        return (
        <div className="div-container">
            <Table compact="very" basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign="center" className={dev_eui ? "" : "hide"}>
                        {dev_eui && this.getDevicePopup(dev_eui, dev_addr, dev_name, dev_vendor)}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" className={gateway && dev_eui ? "" : "hide"}>
                        <i className="fas fa-ellipsis-h icon-font-arrows-h" ></i>
                        <i className="fas fa-ellipsis-h icon-font-arrows-h" ></i>
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" className={gateway ? "" : "hide"}>
                        {gateway && this.getGatewayPopup(gw_name, gateway, gw_vendor)}
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell className={dev_name || gw_name ? "icon-description" : "hide"} textAlign= "center">{dev_name? dev_name : ""}</Table.Cell>
                    <Table.Cell  className={dev_name || gw_name ? "icon-description" : "hide"}></Table.Cell>
                    <Table.Cell className={dev_name || gw_name ? "icon-description" : "hide"} textAlign= "center">{gw_name? gw_name : ""}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell className={dev_vendor || gw_vendor ? "icon-description" : "hide"} textAlign= "center">{dev_vendor? dev_vendor : ""}</Table.Cell>
                    <Table.Cell  className={dev_vendor || gw_vendor ? "icon-description" : "hide"}></Table.Cell>
                    <Table.Cell className={dev_vendor || gw_vendor ? "icon-description" : "hide"} textAlign= "center">{gw_vendor? gw_vendor : ""}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell className={dev_eui ? "" : "hide"} textAlign= "center">
                        {this.getIconDescription(dev_eui)}
                    </Table.Cell>
                    <Table.Cell  className={gateway && dev_eui ? "" : "hide"}></Table.Cell>
                    <Table.Cell className={gateway ? "" : "hide"} textAlign= "center">
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
