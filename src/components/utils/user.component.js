import * as React from "react";
import { observer, inject } from "mobx-react";
import { Icon, Dropdown } from "semantic-ui-react";

import logo from '../../img/rolaguard-logo-white.svg'

@inject("authStore", "usersStore", "notificationStore")
@observer
class UserComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      urlImage: logo
    };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    let username = this.props.authStore.username || localStorage.getItem("user_username");
    this.getData(username);
  }

  getData = username => {
    this.props.usersStore.getUserByUsernameApi(username).then(response => {
      let user = response.data;
      localStorage.setItem("user_username", user.username);
      this.props.usersStore.currentUser = user;

      this.setState({user: user});
    });

    // this.props.rolesStore.getRolesApi();
  };

  logout() {
    this.props.authStore.clean();
    this.props.history.push("/login");
  };

  render() {
    return (
      <div>
        <div className={`sidebar-user ${this.props.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {/* <img className={`animated fadeIn profile-image ${this.props.sidebarCollapsed ? 'sidebar-collapsed' : ''}`} src={urlImage} alt="" /> */}
          <div style={{height:419, position: "relative", width:"100%"}}>
            <strong style={{position: "absolute", bottom: 0, left:25}}>Organization:</strong>
          </div>

          {this.state.user &&
            <Dropdown
              trigger={
                <React.Fragment>
                  <Icon className="sidebar-options-icon large" name="bars"/>
                  <span className="sidebar-username">
                    {this.state.user.organization_name}
                  </span>
                </React.Fragment>
              }
              options={[
                {
                  className: 'text-right',
                  icon: 'user',
                  key: 'username',
                  text: (
                    <React.Fragment>
                      <strong>{this.state.user.username}</strong>
                      <p>{this.state.user.full_name}</p>
                    </React.Fragment>
                  ),
                  disabled: true,
                },
                {
                  key: 'sign-out',
                  text: 'Sign Out',
                  icon: 'sign out',
                  onClick: this.logout
                },
              ]}
            />
          }
        </div>
      </div>
    );
  }
}

export default UserComponent;
