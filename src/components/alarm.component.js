import * as React from 'react';
import { observer, inject } from "mobx-react"
import { Popup, Table } from "semantic-ui-react";
import LoaderComponent from "./utils/loader.component";

@inject('alarmStore')
@observer
class AlarmsComponent extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading: true,
            ...props
        }
    }

    componentWillMount() {
        if(this.props.alarmStore.alarmList[0])
            this.setState({ isLoading : false })
        this.props.alarmStore.getAlarm().then(() => this.setState({ isLoading : false }))
    }
    
    render() {
        const { deviceStore, alarmStore, history } = this.props;

        let headers = [
            {
                name: "NAME",
                visible: true
            }, 
            {
                name: "DESCRIPTION",
                visible: true
            },
            {
                name: "ACTIVE",
                visible: true
            }, 
            {
                name: "ACTIONS",
                visible: true
            }
        ]

        let headerToShow = headers.map((header, index) => {
            if(header.visible){
                return (
                    <Table.HeaderCell key={ "header-" + index }>{ header.name }</Table.HeaderCell>
                )
            }
        })

        let alarmsList = alarmStore.alarmList.map((alarm, index) => {
            return (
                <Table.Row key={ alarm.id + "-" + index }>
                    <Table.Cell>{ alarm.id }</Table.Cell>
                    <Table.Cell>{ alarm.name }</Table.Cell>
                    <Table.Cell>{ alarm.devices }</Table.Cell>
                    <Table.Cell>
                        <div className="td-actions">
                            {/* EDIT BUTTON */}
                            <Popup trigger={
                                <button >
                                    <i className="fas fa-edit"></i>
                                </button>
                            } content='Edit alarm' />
                            
                            {/* DELETE BUTTON */}
                            <Popup trigger={
                                <button>
                                    <i className="fas fa-trash"></i>
                                </button>
                            } content='Remove alarm' />
                        </div>
                    </Table.Cell>
                </Table.Row>
            )
        })  

        return (
            <div className="app-body-container-view">
                <div className="animated fadeIn animation-view">
                    <div className="view-header">
                        {/* HEADER TITLE */}
                        <h1>ALARM LIST</h1>
                        
                        {/* HEADER ACTIONS */}
                        <div className="view-header-actions">
                            <div className="search-box">
                                <i className="fas fa-search"></i>
                                <input type="text" placeholder="search"/>
                            </div>
                            <div>
                                <i className="fas fa-plus"></i><span>NEW ALARM</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* VIEW BODY */}
                    <div className="view-body">
                        { this.state.isLoading && ( 
                            <LoaderComponent loadingMessage="Loading alarms..."/>
                        )}
                        { !this.state.isLoading && (
                            <Table className="animated fadeIn" basic='very'>
                                <Table.Header>
                                    <Table.Row>
                                        { headerToShow }
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    { alarmsList }
                                </Table.Body>
                            </Table>
                        )}
                    </div> 
                </div>  
            </div>
        )
    }
}

export default AlarmsComponent