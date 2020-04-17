import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, Table, Label } from "semantic-ui-react";
import Moment from "react-moment";
import AlertUtil from "../util/alert-util";

@inject("notificationStore", "usersStore")
@observer
class DeleteNotificationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false, 
      buttonLoading: false,
      comment: ''

    };
  }

  handleOpen = e => {
    e.preventDefault();
    this.setState({ modalOpen: true });
  };

  handleClose = e => {
    
    this.setState({ modalOpen: false });
  };

  removeNotification = () => {
    this.setState({buttonLoading: true});
    this.props.notificationStore.delete(this.props.notification.id).then(
      () => {
        this.setState({buttonLoading: false});
        this.props.handleNotificationRemoval();
        this.handleClose();
      }
    )
  }

  render() {
    const { modalOpen, buttonLoading } = this.state;
    const { notification } = this.props

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen} disabled={buttonLoading}>
                <i className="fas fa-trash"/>
              </button>
            }
            content="Remove notification"
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"tiny"}
        closeOnDimmerClick={false}
        closeOnEscape={false}>
        <Modal.Header primary="true">
          <i className="fas fa-trash" /> Remove notification
        </Modal.Header>
        <Modal.Content>
        <Table className="animated fadeIn" basic definition compact>
            <Table.Body>
              <Table.Row>
                <Table.Cell>RISK</Table.Cell>
                <Table.Cell><Label horizontal style={{backgroundColor: AlertUtil.getColorsMap()[notification.alertType.risk], color: 'white', borderWidth: 1, borderColor: AlertUtil.getColorsMap()[notification.alertType.risk]}}>{notification.alertType.risk}</Label></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DESCRIPTION</Table.Cell>
                <Table.Cell>{notification.alertType.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DATE</Table.Cell>
                <Table.Cell>{<Moment format="YYYY-MM-DD HH:mm">{notification.createdAt}</Moment>}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            disabled={buttonLoading}
            onClick={() => this.handleClose()}
            content="Cancel"
          />
          <Button
            positive
            content="Remove"
            disabled={buttonLoading}
            loading={buttonLoading}
            onClick={() => this.removeNotification()}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeleteNotificationModal;
