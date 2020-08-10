import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, Label, TextArea, Form, Table } from "semantic-ui-react";
import Moment from "react-moment";
import Validation from "../util/validation";
import AlertUtil from "../util/alert-util";
import DeviceIdComponent from "./utils/device-id.component";

@inject("deviceStore", "usersStore")
@observer
export default class QuarantineRemoveModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      modalOpen: false,
      comment: ''
    };
  }

  handleOpen = e => {
    e.preventDefault();

    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    this.setState({ modalOpen: false, comment: '' });
  };

  handleDelete() {
    this.setState({ loading: true, error: false });

    this.props.deviceStore.removeQuarantine(this.props.item, this.state.comment).then(
      () => {
        this.setState({ modalOpen: false, loading: false, comment: '' });
        this.props.handleQuarantineRemoval();
      },
      () => {
        this.setState({ loading: false, error: true });
      }
    );
  }

  handleChange = (e, { value }) => {

    const comment = value;
    this.setState({ comment });
  }

  render() {
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);
    const { modalOpen, error, loading, comment } = this.state;
    const { item } = this.props;

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen} disabled={!isAdmin}>
                <i className="fas fa-trash" />
              </button>
            }
            content={isAdmin ? "Remove issue" : "Remove issue (only for admin users)"}
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"mini"}
        closeOnDimmerClick={false}
        closeOnEscape={false}>
        <Modal.Header>
          <i className="fas fa-trash" /> Remove issue
        </Modal.Header>
        <Modal.Content>
            <Table className="animated fadeIn" basic definition compact>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>ID/ADDRESS</Table.Cell>
                  <Table.Cell className="upper">
                    <DeviceIdComponent parameters={item.alert.parameters} alertType={alert.type}/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>RISK</Table.Cell>
                  <Table.Cell><Label horizontal style={{backgroundColor: AlertUtil.getColorsMap()[item.alert_type.risk], color: 'white', borderWidth: 1}}>{item.alert_type.risk}</Label></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>DESCRIPTION</Table.Cell>
                  <Table.Cell>{item.alert_type.name}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>DATE</Table.Cell>
                  <Table.Cell>{<Moment format="YYYY-MM-DD HH:mm">{item.since}</Moment>}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>DATA SOURCE</Table.Cell>
                  <Table.Cell>{item.data_collector_name}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Form>
              <TextArea placeholder='Leave a comment (required)' value={comment} onChange={this.handleChange} style={{resize: 'none'}}/>
              <span>
                {error && (
                  <Label basic color='red'>We are sorry. It has been an error while trying to remove this issue.</Label>
                )}
              </span>
          </Form>
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
            disabled={!comment || comment.trim() === ''}
            onClick={() => this.handleDelete()}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
