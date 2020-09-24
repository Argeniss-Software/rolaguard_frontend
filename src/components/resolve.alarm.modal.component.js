import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Modal, Popup, TextArea, Form, Table, Label } from "semantic-ui-react";
import Validation from "../util/validation";
import Moment from "react-moment";
import AlertUtil from "../util/alert-util";
import DeviceIdComponent from "./utils/device-id.component";

@inject("alarmStore", "alertStore", "authStore", "generalDataStore", "usersStore", "globalConfigStore")
@observer
class ResolveAlarmModal extends Component {
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

  resolveAlert = () => {
    this.setState({buttonLoading: true});
    this.props.alertStore.markAsResolved(this.props.alarm.alert.id, this.state.comment).then(() => {
        this.setState({buttonLoading: false});
        this.props.handleAlertResolution();
        this.handleClose();
      });
  }

  handleChange = (e, { value }) => {

    const comment = value;
    this.setState({ comment });
  }

  render() {
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);
    const { modalOpen, buttonLoading, comment } = this.state;
    const {alert, alert_type} = this.props.alarm

    return (
      <Modal
        trigger={
          <Popup
            trigger={
              <button onClick={this.handleOpen} disabled={!isAdmin}>
                <i
                  className={
                    buttonLoading
                      ? "fas fa-spinner fa-spin square outline"
                      : "fas fa-clipboard-check rectangle"
                  }
                />
              </button>
            }
            content={isAdmin ? "Resolve" : "Resolve (only for admin users)"}
          />
        }
        centered={false}
        open={modalOpen}
        onClose={this.handleClose}
        size={"tiny"}
        closeOnDimmerClick={false}
        closeOnEscape={false}
      >
        <Modal.Header primary="true">
          <i className="fas fa-paint brush" /> Mark alert as resolved
        </Modal.Header>
        <Modal.Content>
          <Table className="animated fadeIn" basic definition compact>
            <Table.Body>
              <Table.Row>
                <Table.Cell>DEVICE</Table.Cell>
                <Table.Cell className="upper">
                  <DeviceIdComponent
                    parameters={alert.parameters}
                    alertType={alert.type}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>RISK</Table.Cell>
                <Table.Cell>
                  <Label
                    horizontal
                    style={{
                      backgroundColor: AlertUtil.getColorsMap()[
                        alert_type.risk
                      ],
                      color: "white",
                      borderWidth: 1,
                      borderColor: AlertUtil.getColorsMap()[alert_type.risk],
                    }}
                  >
                    {alert_type.risk}
                  </Label>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DESCRIPTION</Table.Cell>
                <Table.Cell>{alert_type.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DATE</Table.Cell>
                <Table.Cell>
                  {
                    <Moment
                      format={
                        this.props.globalConfigStore.dateFormats.moment
                          .dateTimeFormat
                      }
                    >
                      {alert.created_at}
                    </Moment>
                  }
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DATA SOURCE</Table.Cell>
                <Table.Cell>{alert.data_collector_name}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Form>
            <TextArea
              placeholder="Leave a comment"
              value={comment}
              onChange={this.handleChange}
              style={{ resize: "none" }}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => this.handleClose()}
            content="Cancel"
          />
          <Button
            positive
            content="Resolve"
            onClick={() => this.resolveAlert()}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ResolveAlarmModal;
