import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, Message } from "semantic-ui-react";


@inject("dataCollectorStore", "authStore")
@observer
class ChangeStatusDataCollectorModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      isUpdating: false,
      hasError: false
    };
  }

  handleOpen = e => {
    e.preventDefault();

    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false });
  };

  handleChangeStatus = () => {
    this.setState({isUpdating: true});
    const { dataCollector } = this.props;
    let { id, status } = dataCollector;
    status = status === 'DISABLED' ? 'ENABLED' : 'DISABLED';
    this.props.dataCollectorStore.updatePartially(id, {status}).then(
      () => {
        this.setState({isUpdating: false, modalOpen: false});
        if(this.props.onConfirm) this.props.onConfirm();
      }
    ).catch(
      () => this.setState({hasError: true, isUpdating: false})
    );
  };

  render() {
    const { modalOpen, isUpdating, hasError } = this.state;
    const { dataCollector } = this.props;
    const { status } = dataCollector;
    const buttonIcon =  status === 'DISABLED' ? 'fas fa-power-off' : 'fas fa-ban';
    const buttonContent = status === 'DISABLED' ? 'Enable data source' : 'Disable data source';
    const body = status === 'DISABLED' ? 'The data source will be enabled. Are you sure?' : 'The data source will be disabled. Are you sure?';

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen}>
                <i className={buttonIcon} />
              </button>
            }
            content={buttonContent}
          />
        }
        closeOnEscape
        closeOnDimmerClick
        closeIcon
        open={modalOpen}
        onClose={this.handleClose}
        size={"mini"}
        closeOnDimmerClick={false}
        closeOnEscape={false}
      >
        <Modal.Header>
          <i className={buttonIcon} /> {buttonContent}
        </Modal.Header>
        <Modal.Content>
          {hasError && (
            <Message
              error
              header="Forbidden"
              content="Something went wrong. Try again later."
            />
          )}
          {!hasError && <p>{body}</p>}
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => this.handleClose()}
            content="Cancel"
            disabled={isUpdating}
          />
          <Button
            positive
            content={status === "DISABLED" ? "Enable" : "Disable"}
            onClick={this.handleChangeStatus}
            loading={isUpdating}
            disabled={isUpdating || hasError}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ChangeStatusDataCollectorModal;
