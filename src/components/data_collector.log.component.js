import * as React from "react";
import { observer, inject } from "mobx-react";
import { Divider, Header, Grid, Icon, Table, Accordion, Pagination, Message } from "semantic-ui-react";
import LoaderComponent from "./utils/loader.component";
import moment from "moment";

@inject("dataCollectorStore")
@observer
class DataCollectorLogComponent extends React.Component {

    state = {
        log: [],
        isLoadingLog: true,
        isLoadingDataCollector: true,
        hasError: false,
        dataCollector: {},
        pagination: {
            page: 1,
            size: 20
        },
        totalPages: 0,
        activeIndex: null
    }

    componentWillMount() {
        this.setState({ dataCollectorId: this.props.match.params.data_collector_id }, 
            () => {
                this.loadDataCollector();
                this.loadPage();
            }
        );
    }

    loadDataCollector() {
        const { dataCollectorId } = this.state;
        this.setState({isLoadingDataCollector: true});
        this.props.dataCollectorStore.getDataCollectorById(dataCollectorId).then(
            res => {
                const dataCollector = res.data;
                this.setState({ dataCollector, isLoadingDataCollector: false });
            }
        ).catch(
            err => {
                this.setState({ isLoadingDataCollector: false, hasError: true });
                console.error(err);
            }
        );
    }

    loadPage() {
        const { dataCollectorId, pagination } = this.state;
        this.setState({isLoadingLog: true});
        this.props.dataCollectorStore.queryLog(dataCollectorId, pagination).then(
          ({ data, headers }) => {
            const log = data;
            const totalItems = headers['total-items'];
            const totalPages = headers['total-pages'];
            this.setState({isLoadingLog: false, totalItems, totalPages, log});
          }
        ).catch(
          err => {
            this.setState({isLoadingLog: false, hasError: true });
            console.error('err', err);
          }
        );
    
    }

    handlePaginationChange = (e, { activePage }) => {
    
        let { pagination } = this.state;
        pagination.page = activePage;
        this.setState({ pagination });
    
        this.loadPage();
    }

    handleAccordionClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
    
        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { dataCollector, totalPages, isLoadingLog, isLoadingDataCollector, pagination, hasError, log, activeIndex } = this.state;
        const { page } = pagination;
        return (
            <div className="app-body-container-view"  style={{minHeight: 300}}>
            <div className="animated fadeIn animation-view">
                <div className="view-header">
                    {/* HEADER TITLE */}
                    <h1>DATA SOURCE LOGS</h1>

                    {/* HEADER ACTIONS */}
                    <div className="view-header-actions">
                    </div>
                </div>
                { hasError && 
                <Message error header='Oops!' content={'Something went wrong. Try again later.'} style={{maxWidth: '100%', marginTop: 50}}/>
                }
                {!hasError && isLoadingDataCollector && (
                    <LoaderComponent loadingMessage="Loading data source..."/>
                )}

                {/* VIEW BODY */}
                {!hasError && !isLoadingDataCollector && <div className="view-body">
                    <Grid columns={4} style={{marginBottom: 10}}>
                        <Grid.Column>
                            <Header as='h2'>Data source</Header>
                            <span style={{fontSize: 19}}>{dataCollector.name}</span>
                        </Grid.Column>                    
                        {dataCollector.type.type !== 'ttn_collector' && <Grid.Column>
                            <Header as='h2'>Address IP</Header>
                            <span style={{fontSize: 19}}>{dataCollector.ip}</span>
                        </Grid.Column>}
                        {dataCollector.type.type === 'ttn_collector' && <Grid.Column>
                            <Header as='h2'>Gateway ID</Header>
                            <span style={{fontSize: 19}}>{dataCollector.gateway_id}</span>
                        </Grid.Column>}
                        <Grid.Column>
                            <Header as='h2'>Current status</Header> 
                            <span style={{height: 10, width: 10, backgroundColor: dataCollector.status === 'CONNECTED' ? '#01dd01' : dataCollector.status === 'DISCONNECTED' ? 'red' : '#c0c0c0', 
                                borderRadius: '50%', marginRight: 8, display: 'inline-block'}}></span>
                            <span style={{fontSize: 19}}>{dataCollector.status.toLowerCase()}</span>
                        </Grid.Column>
                        <Grid.Column>
                            <Header as='h2'>Last message</Header>
                            <span style={{fontSize: 19}}>{dataCollector.lastMessage ? moment(dataCollector.lastMessage).format('MMMM Do YYYY, HH:mm:ss') : 'No messages in last 4 hours'}</span>
                        </Grid.Column>
                    </Grid>

                    <Header as='h2' style={{marginBottom: 3}}>Events</Header>
                    <Divider style={{marginTop: 0}}></Divider>
                    {!isLoadingLog && log.length === 0 && (
                        <h3 style={{textAlign: 'center'}}>No events</h3>
                    )}
                    {isLoadingLog && (
                        <LoaderComponent loadingMessage="Loading events..." />
                    )}
                    {!isLoadingLog && log.length > 0 && (
                    <Table fixed>
                        <Table.Header style={{backgroundColor: 'whitesmoke'}}>
                        <Table.Row>
                            <Table.HeaderCell>Datetime</Table.HeaderCell>
                            <Table.HeaderCell>Event</Table.HeaderCell>
                            <Table.HeaderCell>Details</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                log.map((item, index) => 
                                    <Table.Row key={index} error={item.type === 'DISCONNECTED' || item.type === 'FAILED_PARSING' || item.type === 'FAILED_LOGIN'}>
                                        <Table.Cell>{moment(item.createdAt).format('MMMM Do YYYY, HH:mm:ss')}</Table.Cell>
                                        <Table.Cell>
                                        {(item.type === 'DISCONNECTED' || item.type === 'FAILED_PARSING'  || item.type === 'FAILED_LOGIN') && <Icon name='attention' />}
                                        {this.getEvent(item)}</Table.Cell>
                                        <Table.Cell>{this.getDescription(item, index, activeIndex)}</Table.Cell>
                                    </Table.Row>    
                                    )
                            }
                        </Table.Body>
                    </Table>
                    )}
                    {totalPages > 1 && !isLoadingLog &&
                    <Grid className="segment centered">    
                        <Pagination className="" activePage={page} onPageChange={this.handlePaginationChange} totalPages={totalPages} />
                    </Grid>}
                </div>}
            </div>
        </div>
        )
    }

    getEvent(event) {
        switch(event.type) {
            case 'CREATED':
                return 'Created';
            case 'UPDATED':
                return 'Updated';
            case 'DISCONNECTED':
                return 'Connection lost';
            case 'CONNECTED':
                return 'Connected';
            case 'ENABLED':
                return 'Manually enabled';
            case 'DISABLED':
                return 'Manually disabled';
            case 'RESTARTED': 
                return 'Restarted by system';
            case 'FAILED_PARSING':
                return 'Failed message parsing';
            case 'DELETED':
                return 'Deleted';
            case 'FAILED_LOGIN':
                return 'Failed login'
            default:
                return '';
        }
    }

    getDescription(event, index, activeIndex) {
        const user = event.user ? event.user.full_name : '';
        switch(event.type) {
            case 'CREATED':
                    return (
                        <div>
                            The data source was created by <b>{user}</b>
                            {event.parameters && <Accordion>
                                <Accordion.Title active={index===activeIndex} index={index} onClick={this.handleAccordionClick}>
                                    <Icon name='dropdown' />
                                    VIEW CONNECTION PARAMETERS
                                </Accordion.Title>
                                <Accordion.Content active={index===activeIndex}>
                                <p style={{overflowWrap: 'break-word'}}>{JSON.stringify(event.parameters)}</p>
                                </Accordion.Content>
                            </Accordion>}
                        </div>);

            case 'UPDATED':
                return (
                    <div>
                        The data source was updated by <b>{user}</b>
                        {event.parameters && <Accordion>
                            <Accordion.Title active={index===activeIndex} index={index} onClick={this.handleAccordionClick}>
                                <Icon name='dropdown' />
                                VIEW CONNECTION PARAMETERS
                            </Accordion.Title>
                            <Accordion.Content active={index===activeIndex}>
                            <p style={{overflowWrap: 'break-word'}}>{JSON.stringify(event.parameters)}</p>
                            </Accordion.Content>
                        </Accordion>}
                    </div>);

            case 'DISCONNECTED':
                return (
                    <div>
                        The data source lost the connection
                        {event.parameters.error && <Accordion>
                            <Accordion.Title active={index===activeIndex} index={index} onClick={this.handleAccordionClick}>
                                <Icon name='dropdown' />
                                VIEW ERROR
                            </Accordion.Title>
                            <Accordion.Content active={index===activeIndex}>
                            <p style={{overflowWrap: 'break-word'}}>{event.parameters.error}</p>
                            </Accordion.Content>
                        </Accordion>}
                    </div>);
            case 'CONNECTED':
                return <span>The connection was established successfully</span>;
            case 'ENABLED':
                return <span>The data source was enabled by <b>{user}</b></span>;
            case 'DISABLED':
                return <span>The data source was disabled by <b>{user}</b></span>;
            case 'RESTARTED': 
                return <span>The connection was restarted by system</span>;
            case 'FAILED_LOGIN':
                return <span>Failed trying to login at TTN Server. Check data source credentials.</span>;
            case 'FAILED_PARSING':
                    return (
                        <div>
                            There was an error when the system tried to process a received message.
                            {event.parameters.message && <Accordion>
                                <Accordion.Title active={index===activeIndex} index={index} onClick={this.handleAccordionClick}>
                                    <Icon name='dropdown' />
                                    VIEW MESSAGE
                                </Accordion.Title>
                                <Accordion.Content active={index===activeIndex}>
                                <p style={{overflowWrap: 'break-word'}}>{event.parameters.message}</p>
                                </Accordion.Content>
                            </Accordion>}
                        </div>);
            case 'DELETED':
                return 'Deleted';
            default:
                return '';
        }
    }

}

export default DataCollectorLogComponent