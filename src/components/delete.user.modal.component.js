import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, Label } from "semantic-ui-react";
import usersStore from "../stores/users.store";

@inject("usersStore", "authStore")
@observer
class DeleteUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      modalOpen: false
    };
  }

  handleOpen = e => {
    e.preventDefault();

    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false });
  };

  handleDelete() {
    this.setState({ loading: true, error: false });

    usersStore.deleteUser(this.props.user).then(
      () => {
        this.props.onSuccess();
        this.setState({ modalOpen: false, loading: false });
      },
      () => {
        this.setState({ loading: false, error: true });
      }
    );
  }

  render() {
    const { modalOpen, error, loading } = this.state;
    const { user } = this.props;

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen}>
                <i className="fas fa-trash" />
              </button>
            }
            content="Remove user"
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"mini"}
        closeOnDimmerClick={false}
        closeOnEscape={false}>
        <Modal.Header>
          <i className="fas fa-trash" /> Remove user
        </Modal.Header>
        <Modal.Content>
          <p>
            The user {user.username} will be removed from the
            system. Are you sure?
          </p>
          {error && (
            <Label basic color='red'>An error has occurred while trying to remove the user.</Label>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            disabled={loading}
            negative
            onClick={() => this.handleClose()}
            content="Cancel"
          />
          <Button
            loading={loading}
            positive
            content="Remove"
            onClick={() => this.handleDelete()}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeleteUserModal;
