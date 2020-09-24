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
                <h3></h3>

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
                    <a onClick={() => { this.selectedItem("current_issues", "/dashboard/current_issues") }} className={this.state.activeItem === "current_issues" ? "active" : ""}>
                      <i className="fas fa-exclamation-triangle"></i>
                      {this.props.sidebarCollapsed === false && (<span>Current Issues</span>)}
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

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("resources-usage", "/dashboard/resources_usage") }} className={this.state.activeItem === "resources-usage" ? "active" : ""}>
                      <i className="fas fa-chart-line"></i>
                      {this.props.sidebarCollapsed === false && (<span>Network Overview</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Resources Usage"
                />

                <h3></h3>

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("events_manager", "/dashboard/events_manager")}} className={this.state.activeItem === "events_manager" ? "active" : ""}>
                      <i className="fas fa-project-diagram"></i>
                      
                      {this.props.sidebarCollapsed === false && (
                        <span>
                          Events Manager
                        </span>
                      )}
                      
                    </a>
                  }
                  style={popupStyle}
                  content="Events Manager"
                />

                <Popup
                  trigger={
                    <a onClick={() => { this.selectedItem("events_log", "/dashboard/events_log") || resetUnread() }} className={this.state.activeItem === "events_log" ? "active" : ""}>
                      <i className="fas fa-file-alt"></i>
                      {this.props.sidebarCollapsed === false && (
                        <span>
                          Events Log {countUnread && <Label color='red' circular>{countUnread}</Label> }
                        </span>
                      )}
                      
                    </a>
                  }
                  style={popupStyle}
                  content="Events log"
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
                      {this.props.sidebarCollapsed === false && (<span>Data Sources</span>)}
                    </a>
                  }
                  style={popupStyle}
                  content="Data Sources"
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