import React, { Component } from "react";
import { inject } from "mobx-react";
import { Button, Modal, Popup, Message } from "semantic-ui-react";

@inject("policyStore")
class DeletePolicyModal extends Component {

  state = {
    modalOpen: false,
    isDefault: false,
    hasDataCollectors: false,
    isDeleting: false,
    generalError: false
  }

  componentWillMount() {
    const { policy } = this.props;
    const { isDefault } = policy;
    const hasDataCollectors = policy.dataCollectors && policy.dataCollectors.length > 0;
    this.setState({isDefault, hasDataCollectors});
  }

  handleOpen = e => {
    e.preventDefault();
    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false });
  };

  delete = () => {
    this.setState({isDeleting: true});
    const id = this.props.policy.id;
    this.props.policyStore.delete(id).then(
      () => {
        this.setState({isDeleting: false});
        this.handleClose();
        this.props.onConfirm();
      }
    ).catch(
      err => {
        let isDefault = false, hasDataCollectors = false, generalError = false;
        switch(err.response.data.code) {
          case 'DEFAULT_POLICY':
            isDefault = true;
            break;
          case 'POLICY_WITH_DATA_COLLECTORS':
            hasDataCollectors = true;
            break;
          default:
            generalError = true;
        }
        this.setState({isDeleting: false, isDefault, hasDataCollectors, generalError});
        console.error(err);
      }
    );
  }

  render() {
    const { modalOpen, isDefault, hasDataCollectors, generalError, isDeleting } = this.state;

    let errorMessages = [];
    if(isDefault) {
      errorMessages.push('This policy can\'t be removed because it\'s the default policy.');
    }
    if(hasDataCollectors) {
      errorMessages.push('This policy can\'t be removed because it\'s used by at least one data source.');
    }
    if(generalError) {
      errorMessages.push('Something went wrong. Try again later.');
    }

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen}>
                <i className="fas fa-trash" />
              </button>
            }
            content="Remove policy"
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"tiny"}
        closeOnDimmerClick={false}
        closeOnEscape={false}>
        <Modal.Header>
          <i className="fas fa-trash" /> Remove policy
        </Modal.Header>
        <Modal.Content>
          { errorMessages.length > 0 && 
            <Message error header='Forbidden' list={errorMessages}/>
          }
          { errorMessages.length === 0 &&
            <p>
              The policy <b>{this.props.policy.name}</b> will be removed from the system. Are you sure?
            </p>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={this.handleClose}
            content="Cancel"
            disabled={isDeleting}
          />
          <Button
            positive
            content="Remove"
            onClick={this.delete}
            disabled={isDefault || hasDataCollectors || generalError}
            loading={isDeleting}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeletePolicyModal;
