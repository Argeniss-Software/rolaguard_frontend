import React from "react";
import { observer, inject } from "mobx-react";

@inject("usersStore")
@observer
class AutoStartTour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: this.props.usersStore.currentUser.email,
        full_name: this.props.usersStore.currentUser.full_name,
        username: this.props.usersStore.currentUser.username,
        phone: this.props.usersStore.currentUser.phone,
        user_roles: this.props.usersStore.currentUser.user_roles,
        first_login: false,
      },
    };
  }

  componentDidMount() {
    const user = this.state.user;

    if (this.props.usersStore.currentUser.first_login) {
      this.props.usersStore.updateUser(user);
      this.props.startTour.start();
    }
  }

  render() {
    return null;
  }
}

export default AutoStartTour;
