import * as React from "react";
import { observer } from "mobx-react";

import MenuComponent from './menu.component';
import UserComponent from "./utils/user.component";

import "./sidebar.component.css";

@observer
class SidebarComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        user: null,
        sidebarCollapsed: false,
      }

      this.toggleSidebar = this.toggleSidebar.bind(this)
    }

    toggleSidebar() {
      this.setState({sidebarCollapsed: !this.state.sidebarCollapsed});
    }

    render() {
        const { history } = this.props;

        return (
          <div className={`app-body-sidebar ${this.state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <UserComponent history={ history } sidebarCollapsed={this.state.sidebarCollapsed}/>
            <div className={`sidebar-menu ${this.state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <div className={`collapse-button-wrapper ${this.state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <span onClick={() => { this.toggleSidebar() }}><i className={`fas fa-${this.state.sidebarCollapsed ? 'plus' : 'minus'}-circle`}/></span>
                </div>
                <MenuComponent history={ history } sidebarCollapsed={this.state.sidebarCollapsed} countUnread={this.props.countUnread} resetUnread={this.props.resetUnread}/>
            </div>
          </div>
        );
    }
}

export default SidebarComponent;
