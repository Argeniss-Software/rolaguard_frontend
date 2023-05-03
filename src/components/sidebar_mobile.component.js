import * as React from "react";
import { observer } from "mobx-react";

import MenuComponent from './menu.component';
import UserComponent from "./utils/user.component";

import "./sidebar.component.css";

@observer
class SidebarMobileComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        user: null,
      }
    }

    render() {
        const { history } = this.props;
        return (
        <div className={`app-body-sidebar `}>
            <UserComponent history={ history } sidebarCollapsed={false}/> 
            <div className={`sidebar-menu `}>
                <MenuComponent history={ history } sidebarCollapsed={false} countUnread={this.props.countUnread} resetUnread={this.props.resetUnread}/>
            </div> 
        </div>
        )
    }

}

export default SidebarMobileComponent;