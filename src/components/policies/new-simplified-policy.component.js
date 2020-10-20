import React, { Component } from "react";
import { inject } from "mobx-react";
import { Button, Modal, Popup, Message, Form, Label } from "semantic-ui-react";

@inject("policyStore")
class NewSimplifiedPolicyModal extends Component {

  state = {
    modalOpen: false,
    isSaving: false,
    error: 'This file is required',
    fatalError: false,
    name: '',
    touched: false
  }

  handleOpen = e => {
    e.preventDefault();
    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false });
  };

  handleChangeOnName = (e, { value }) => {
    let error = null;
    if(value.length === 0) error = 'This field is required';
    else if(value.length < 3) error = 'Name length must be greater than 3';
    else if(value.length > 100) error = 'Name length can\'t be greater than 100';
    this.setState({error, name: value, touched: true});
  }

  save = () => {
    const { policy } = this.props;
    const { name } = this.state;
    delete policy.id;
    policy.name = name;
    this.setState({ isSaving: true});
    this.props.policyStore.post(policy).then(
      () => {
        this.setState({ isSaving: false});
        this.props.callback();
      }
    ).catch(this.handleApiError);
  }

  handleApiError = error => {
    console.error(error);
    if(!error.response || error.response.status !== 400) {
      this.setState({ isSaving: false, error: null, fatalError: true });
    } else {
      const nameError = error.response.data.find(err => err.code === 'EXISTING_NAME');
      if(nameError) {
        this.setState({ isSaving: false, error: 'Exists a policy with this name', fatalError: false });
      } else {
        this.setState({ isSaving: false, error: null, fatalError: true });
      }
      
    }
  }


  render() {
    const { modalOpen, fatalError, isSaving, error, name, touched } = this.state;

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen}>
                <i className="far fa-copy" />
              </button>
            }
            content="Clone policy"
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"tiny"}
        closeOnDimmerClick={false}
        closeOnEscape={false}
      >
        <Modal.Header>Clone a policy</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Name"
              fluid
              placeholder="Name"
              error={!!error && touched}
              value={name}
              onChange={this.handleChangeOnName}
            />
            {error && touched && (
              <Label basic color="red" pointing style={{ marginTop: -5 }}>
                {" "}
                {error}{" "}
              </Label>
            )}
          </Form>
          {fatalError && (
            <Message
              error
              header="Oops!"
              content={"Something went wrong. Try again later."}
              style={{ maxWidth: "100%" }}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={this.handleClose}
            content="Cancel"
            disabled={isSaving}
          />
          <Button
            positive
            content="Clone"
            onClick={this.save}
            disabled={!!error || fatalError || isSaving}
            loading={isSaving}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default NewSimplifiedPolicyModal;
