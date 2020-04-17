import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Icon,
  Header,
  Grid,
  Button,
  Divider
} from "semantic-ui-react";
import "./user.profile.component.css";
import rolesStore from "../stores/roles.store";
import LoaderComponent from "./utils/loader.component";

@inject("usersStore", "messageStore", "authStore", "rolesStore")
@observer
class UserProfileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      user: {
        username: "",
        type: "",
        email: "",
        full_name: "",
        phone: "",
        organization_name: ""
      }
    };

  }

  componentDidMount() {
    this.setState({ isLoading: true })

    if (this.props.match.params.username) {
      this.getData(this.props.match.params.username);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.match.params.username);
  }

  getData = username => {
    this.props.usersStore.getUserByUsernameApi(username).then(response => {
      let user = this.state.user;

      for (let key in response.data) {
        user[key] = response.data[key];
      }

      this.setState({
        isLoading: false,
        user: user
      });
    });
  };

  render() {
    const { isLoading, user } = this.state;
    const { history } = this.props;

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view dashboard">
          <div id="user-profile-view" className="view-header">
            {/* HEADER TITLE */}
            <div>
            <h1>USER PROFILE</h1>
            </div>
            {!isLoading && user && <div className="view-header-actions" >
              <div onClick={() => history.push(`/dashboard/users/${user.username}`)}>
                <i className="fas fa-plus" />
                <span>EDIT USER</span>
              </div>
            </div>
            }
          </div>
          <Divider></Divider>
          {/* VIEW BODY */}
          <div className="view-body">
            {isLoading && 
                <LoaderComponent loadingMessage="Loading user..." />
            }
            {!isLoading && user && (
              <div>
                <Grid className="animated fadeIn">
                  <Grid.Column mobile={16} tablet={8} computer={8}>
                    <Header style={{ marginTop: "0", fontSize: "2.5em" }}>
                      {user.full_name}
                    </Header>
                    <div style={{ marginTop: "2em" }}>
                      <Header disabled>
                        <Icon name="user" />
                        User Name: {user.username}
                      </Header>
                      <Header disabled>
                        <Icon name="id badge" />
                        Roles: {rolesStore.getRolesAsString(user)}
                      </Header>
                      <Header disabled>
                        <Icon name="id card" />
                        Name: {user.full_name}
                      </Header>

                      <Header disabled>
                        <Icon name="mail" />
                        E-mail: {user.email}
                      </Header>
                      <Header disabled>
                        <Icon name="factory" />
                        Organization: {user.organization_name}
                      </Header>
                      <Header disabled>
                        <Icon name="phone" />
                        Phone: {user.phone}
                      </Header>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            )}
          </div>
        </div>
        <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end"
                      }}>
                      <Button
                        type="reset"
                        disabled={this.state.loading}
                        content="Back"
                        onClick={() => {this.props.history.goBack()}}
                      />
                    </div>
      </div>
    );
  }
}

export default UserProfileComponent;
