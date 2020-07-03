import React, { Component } from "react";
import { Popup, Table } from "semantic-ui-react";

import gatewaySvg from '../../img/gateway.svg'
import microchipSvg from '../../img/microchip.svg'
import "./inventory.modal.icon.component.css";

class ItemDetailsIcon extends Component {

    constructor(props){
        super(props);
        this.state = {
            gatewayUrl: gatewaySvg,
            microchipUrl: microchipSvg
        }
    }

    getGatewayPopup(item) {
        return (
            <Popup trigger={
                <div>
                    <img id="gateway-inventory-logo" className="animated" src={this.state.gatewayUrl} alt=""/>
                </div>
                } flowing hoverable>
                <div className="device-popup">
                    <span className={item.name ? "" : "hide"}>{item.name ? "GW NAME: " + item.name.toUpperCase() : ""}</span>
                    <span className={item.id ? "" : "hide"}>{item.id ? "GW ID: " + item.id.toUpperCase() : ""}</span>
                    <span className={item.data_collector ? "" : "hide"}>{item.data_collector ? "DATA COLLECTOR: " + item.data_collector.toUpperCase() : ""}</span>
                </div>
            </Popup>
        );
    }

    getDevicePopup(item) {
        return (
            <Popup trigger={
                <div>
                    <img id="device-inventory-logo" className="animated" src={this.state.microchipUrl} alt=""/>
                </div>
                } flowing hoverable>
                <div className="device-inventory-popup">
                    <span className={item.name ? "" : "hide"}>{item.name ? "DEVICE NAME: " + item.name.toUpperCase() : ""}</span>
                    <span className={item.id ? "" : "hide"}>{item.id ? "DEV EUI: " + item.id.toUpperCase() : ""}</span>
                </div>
            </Popup>
        );
    }

    getIconDescription(value) {
        return (
            <span className="icon-inventory-description">{value ? value.toUpperCase() : ""}</span>
        );
    }

    render(){
        const { item } = this.props;
        return (
        <div className="div-inventory-container">
            <Table compact="very" basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign="center" className={item.type ? "" : "hide"}>
                        {item.type.trim().toLowerCase() === 'device' && this.getDevicePopup(item)}
                        {item.type.trim().toLowerCase() === 'gateway' && this.getGatewayPopup(item)}
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell className={item.type ? "" : "hide"}>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
            </Table>
        </div>
        ); 
    }
}

export default ItemDetailsIcon;
