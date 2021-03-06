import * as React from 'react';
import { observer, inject } from "mobx-react"

//components
import DashBoardRouter from '../components/dashboard.router';
import AuthComponent from '../components/auth.component';
import SidebarComponent from '../components/sidebar.component';
import AlertComponent from '../components/alert/alert.component';

import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import { subscribeToNewNotificationEvents, unsubscribeFromNewNotificationEvents } from "../util/web-socket";

@inject('authStore', 'alertStore', 'notificationStore')
@observer
class DashboardPage extends React.Component {

    notificationSubscriber = null;
    state = {
        countUnread: null
    }
    
    toggleVisibility = () => {
        this.props.history.push("/dashboard/pepe")
    }

    componentWillMount() {
        this.getNotificationsCount();    
    }

    getNotificationsCount = () => {
        this.props.notificationStore.getCountOfUnread().then(
          res => {
            if(res.data.count > 0) {
              this.setState({ countUnread: res.data.count });
            }
          }
        )
    }

    resetUnread = () => {
        this.setState({countUnread: null});
    }

    componentDidMount() {
        this.notificationSubscriber = subscribeToNewNotificationEvents(notification => {
            this.getNotificationsCount();
            toast(
                {
                    title: notification.type === 'NEW_ALERT' ? 'New alert' : 'New notification',
                    description: notification.type === 'NEW_ALERT' ? <p> {notification.alertType.name}  </p> : '',
                    time: 3000
                },
                () => {},
                () => this.props.history.push("/dashboard/notifications")
            );
        });
    }

    componentWillUnmount() {
        unsubscribeFromNewNotificationEvents(this.notificationSubscriber);
    }

    render() {
        let view =  <div className="animated fadeIn app-container">
            { this.props.alertStore.alertVisible && ( <AlertComponent /> ) }
            <div className="app-header">
                {/* <div className="animated fadeIn app-header-logo">
                    <h1>IOT</h1>
                </div> */}
            </div>
            <div className="app-body">
                <SidebarComponent history={ this.props.history } countUnread={this.state.countUnread} resetUnread={this.resetUnread}/>
                <div className="app-body-container">
                    <DashBoardRouter />
                </div>
            </div>
            <div style={{position: 'absolute', right:18, top: 18}}>
                <SemanticToastContainer position="top-right" />
            </div>
        </div>

        return (
            <AuthComponent component={ view } />
        );
    }
}

export default DashboardPage