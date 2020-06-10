import * as React from 'react';
import { observer, inject } from "mobx-react"
import Validation from "../util/validation";
import { Popup, Label } from "semantic-ui-react";

@inject("usersStore")
@observer
class MenuComponent extends React.Component {

    constructor(props) {
        super(props)

        let location = props.history.location.pathname.split("/")[2]
        let activeItem = location != null ? location.indexOf("map") > -1 ? location : location.substring(0, location.length - 1) : "dashboard"

        this.state = {
          sidebarCollapsed: false,
            activeItem: activeItem,
            ...props
        }
    }

    selectedItem = (name, url) => {
        this.setState({
            activeItem: name
        })
        this.props.history.push(url)
    }

    render() {
        const { countUnread, resetUnread } = this.props;

        const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

        const popupStyle = {
          opacity: this.props.sidebarCollapsed ? "1" : "0"
        }

        return (
            <nav className="animated fadeInLeft">
                {this.props.sidebarCollapsed === false && (<h3>Views</h3>)}

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("dashboard", "/dashboard") }} className={this.state.activeItem === "dashboard" ? "active" : ""}>
                      <i className="fas fa-tachometer-alt"></i>
                      {this.props.sidebarCollapsed === false && (<span>Dashboard</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Dashboard"
                />
                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("quarantine", "/dashboard/quarantine") }} className={this.state.activeItem === "quarantine" ? "active" : ""}>
                      <i className="fas fa-bug"></i>
                      {this.props.sidebarCollapsed === false && (<span>Quarantine</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Quarantine"
                />
                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("alerts_review", "/dashboard/alerts_review") }} className={this.state.activeItem === "alerts_review" ? "active" : ""}>
                      <i className="fas fa-exclamation-circle"></i>
                      {this.props.sidebarCollapsed === false && (<span>Alerts</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Alerts"
                />

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("inventory", "/dashboard/inventory") }} className={this.state.activeItem === "inventory" ? "active" : ""}>
                      <i className="fas fa-microchip"></i>
                      {this.props.sidebarCollapsed === false && (<span>Inventory</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Inventory"
                />  

                {this.props.sidebarCollapsed === false && <h3>Administration</h3>}

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("notifications", "/dashboard/notifications") || resetUnread() }} className={this.state.activeItem === "notifications" ? "active" : ""}>
                      <i className="fas fa-bell"></i>
                      
                      {this.props.sidebarCollapsed === false && (
                        <span>
                          Notifications {countUnread && <Label color='red' circular>{countUnread}</Label> }
                        </span>
                      )}
                      
                    </a>
                  }
                  style={popupStyle}
                  content="Notifications"
                />

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("alarm", "/dashboard/policies") }} className={this.state.activeItem === "alarm" ? "active" : ""}>
                      <i className="fas fa-shield-alt"></i>
                      {this.props.sidebarCollapsed === false && (<span>Policies</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Policies"
                />

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("data_collector", "/dashboard/data_collectors") }} className={this.state.activeItem === "data_collector" ? "active" : ""}>
                      <i className="fas fa-sitemap"></i>
                      {this.props.sidebarCollapsed === false && (<span>Message Collectors</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Message Collectors"
                />

                {isAdmin && (
                  <Popup
                    trigger={
                      <a onClick={() => { this.selectedItem("user", "/dashboard/users") }} className={this.state.activeItem === "user" ? "active" : ""}>
                        <i className="fas fa-users"></i>
                        {this.props.sidebarCollapsed === false && (<span>Users</span>)}
                      </a>
                    }
                    style={popupStyle}
                    content="Users"
                  />
                )}
            </nav>
        );
    }
}

export default MenuComponent