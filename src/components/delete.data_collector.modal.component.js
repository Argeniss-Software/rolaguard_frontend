import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, Checkbox } from "semantic-ui-react";

@inject("dataCollectorStore", "authStore")
@observer
class DeleteDataCollectorModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      isDeleting: false,
      confirmed: false
    };
  }

  handleOpen = e => {
    e.preventDefault();

    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false });
  };

  handleConfirm = e => {
    this.setState({ confirmed: !this.state.confirmed });
  };

  delete = () => {
    this.setState({isDeleting: true});
    this.props.dataCollectorStore.deleteDataCollector(this.props.dataCollector).then(
      res => {
        this.setState({isDeleting: false, confirmed: false});
        this.handleClose();
        if(this.props.callback) this.props.callback();
      }
    )
  }

  render() {
    const { modalOpen, isDeleting, confirmed } = this.state;

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen}>
                <i className="fas fa-trash" />
              </button>
            }
            content="Remove"
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"mini"}
        closeOnDimmerClick={false}
        closeOnEscape={false}>
        <Modal.Header>
          <i className="fas fa-trash" /> Remove message collector
        </Modal.Header>
        <Modal.Content>
          <p>
            The message collector <b>{this.props.dataCollector.name}</b> and all its alerts will be removed from the
            system. Are you sure?
          </p>
          <Checkbox 
            label="Please confirm, this action cannot be undone" 
            onChange={this.handleConfirm}
            checked={confirmed}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => this.handleClose()}
            content="Cancel"
            disabled={isDeleting}
          />
          <Button
            positive
            disabled={isDeleting || !confirmed}
            loading={isDeleting}
            content="Remove"
            onClick={this.delete}
            
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeleteDataCollectorModal;
