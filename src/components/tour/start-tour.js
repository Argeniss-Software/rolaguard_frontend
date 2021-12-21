import React from "react";
import { observer, inject } from "mobx-react";
 
@inject("usersStore")
@observer
class StartTour extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      user: {
        email: "",
        full_name: "",
        username: "",
        phone: "",
        user_roles: "",
        first_login: null,
      },
    };
  }
 
  componentDidMount() {
    const user = this.state.user;
 
    user.email = this.props.usersStore.currentUser.email;
    user.full_name = this.props.usersStore.currentUser.full_name;
    user.phone = "";
    user.user_roles = this.props.usersStore.currentUser.user_roles;
    user.username = this.props.usersStore.currentUser.username;
 
    const isFirstLogin = this.props.usersStore.currentUser.first_login;
    if (isFirstLogin && this.props.startTour) {
      user.first_login=false;
      this.props.usersStore.updateUser(user);
      this.props.startTour.start();
    }
  }
 
  render() {
    return null;
  }
}
 
export default StartTour;