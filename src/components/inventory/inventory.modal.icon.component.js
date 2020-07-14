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

    getGatewayPopup(id, name, vendor) {
        return (
            <Popup trigger={
                <div>
                    <img id="gateway-inventory-logo" className="animated" src={this.state.gatewayUrl} alt=""/>
                </div>
                }
                flowing hoverable
                position="bottom center"
                >
                <div className="device-popup">
                    <span className={name ? "" : "hide"}>{name ? "GW NAME: " + name : ""}</span>
                    <span className={id ? "" : "hide"}>{id ? "GW EUI: " + id.toUpperCase() : ""}</span>
                    <span className={vendor ? "" : "hide"}>{vendor ? "GW VENDOR: " + vendor : ""}</span>
                </div>
            </Popup>
        );
    }

    getDevicePopup(id, name, vendor) {
        return (
            <Popup trigger={
                <div>
                    <img id="device-inventory-logo" className="animated" src={this.state.microchipUrl} alt=""/>
                </div>
                }
                flowing hoverable
                position="bottom center"
                >
                <div className="device-popup">
                    <span className={name ? "" : "hide"}>{name ? "DEVICE NAME: " + name : ""}</span>
                    <span className={id ? "" : "hide"}>{id ? "DEV EUI: " + id.toUpperCase() : ""}</span>
                    <span className={vendor ? "" : "hide"}>{vendor ? "DEV EUI: " + vendor : ""}</span>
                </div>
            </Popup>
        );
    }

    render(){
        
        const { type, name, vendor, id } =this.props.item;
        

        return (
            <div className="div-inventory-container">
                <Table compact="very" basic="very">
                <Table.Header>
                    <Table.Row>
                        {type.trim().toLowerCase() === 'device' &&
                            <Table.HeaderCell textAlign="center">
                                {this.getDevicePopup(id, name, vendor)}
                            </Table.HeaderCell>
                        }
                        {type.trim().toLowerCase() === 'gateway' &&
                            <Table.HeaderCell textAlign="center">
                                {this.getGatewayPopup(id, name, vendor)}
                            </Table.HeaderCell>
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell className={name ? "icon-description" : "hide"} textAlign= "center">{name ? name : ""}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={vendor ? "icon-description" : "hide"} textAlign= "center">{vendor ? vendor : ""}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={id ? "icon-description" : "hide"} textAlign= "center">{id? id.toUpperCase() : ""}</Table.Cell>
                    </Table.Row>
                </Table.Body>
                </Table>
            </div>
        );
    }
}

export default ItemDetailsIcon;
