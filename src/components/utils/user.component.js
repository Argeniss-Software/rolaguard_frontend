import * as React from "react";
import { observer, inject } from "mobx-react";
import { Icon, Dropdown } from "semantic-ui-react";

import logo from "../../img/rolaguard-logo-white.svg";

@inject("authStore", "usersStore", "notificationStore")
@observer
class UserComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      urlImage: logo,
    };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    let username =
      this.props.authStore.username || localStorage.getItem("user_username");
    this.getData(username);
  }

  getData = (username) => {
    this.props.usersStore.getUserByUsernameApi(username).then((response) => {
      let user = response.data;
      localStorage.setItem("user_username", user.username);
      this.props.usersStore.currentUser = user;

      this.setState({ user: user });
    });

    // this.props.rolesStore.getRolesApi();
  };

  logout() {
    this.props.authStore.clean();
    this.props.history.push("/login");
  }

  render() {
    return (
      <div>
        <div
          className={`sidebar-user ${
            this.props.sidebarCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          {this.state.user && (
            <div style={{ height: 419, position: "relative", width: "100%" }}>
              <strong style={{ position: "absolute", bottom: 5, left: 25 }}>
                Organization:
              </strong>
              <span style={{ position: "absolute", top: 45, left: 65 }}>
                {this.state.user.organization_name}
              </span>
            </div>
          )}
          <div style={{ height: 419, position: "relative", width: "100%" }}>
            <strong style={{ position: "absolute", top: 30, left: 25 }}>
              <Icon name="user circle" size="big" />
              {this.state.user && (
                <Dropdown
                  style={{ left: 5 }}
                  trigger={
                    <React.Fragment>
                      <span className="sidebar-username">
                        {this.state.user.username}
                      </span>
                    </React.Fragment>
                  }
                  options={[
                    {
                      key: "edit-profile",
                      text: "Edit Profile",
                      icon: "edit",
                      onClick: () => {
                        this.props.history.push(
                          `/dashboard/users/${this.state.user.username}`
                        );
                      },
                    },
                    {
                      key: "sign-out",
                      text: "Sign Out",
                      icon: "sign out",
                      onClick: this.logout,
                    },
                  ]}
                />
              )}
            </strong>
          </div>
        </div>
      </div>
    );
  }
}

export default UserComponent;
