import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, Label } from "semantic-ui-react";

@inject("usersStore", "authStore", "messageStore")
@observer
class ResendActivationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptDisabled: false,
      error: false,
      success: false,
      modalOpen: false,
      loading: false
    };
  }

  handleOpen = e => {
    e.preventDefault();

    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false });
  };

  resendActivation = user => {
    this.setState({ loading: true, error: false, success: false, acceptDisabled: false });
    
    this.props.usersStore.resendActivation(user).then(response => {
      this.setState({ loading: false, success: true, acceptDisabled: true });
    },
    () => {
      this.setState({ loading: false, error: true, acceptDisabled: false });
    });
  };

  render() {
    const { modalOpen, error, success } = this.state;
    const { user } = this.props;

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen}>
                <i className="fas fa-redo" />
              </button>
            }
            content="Resend account activation"
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"mini"}
        closeOnDimmerClick={false}
        closeOnEscape={false}>
        <Modal.Header>
          <i className="fas fa-trash" /> Resend activation
        </Modal.Header>
        <Modal.Content>
          <p>
            A new activation token will be sent to {user.username} ({user.email}). Are you sure?
          </p>
          {success && (
            <Label basic color='green'>Activation email was successfully sent.</Label>
          )}
          {error && (
            <Label basic color='red'>An error has occurred while trying to send the activation email.</Label>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            disabled={this.state.loading}
            negative
            onClick={() => this.handleClose()}
            content="Cancel"
          />
          <Button
            disabled={this.state.acceptDisabled}
            positive
            content="Accept"
            loading={this.state.loading}
            onClick={() => this.resendActivation(user)}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ResendActivationModal;
