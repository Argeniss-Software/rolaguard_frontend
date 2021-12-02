import * as React from "react";
import { inject } from "mobx-react";
import Moment from "react-moment";
import { Table, Popup, Label, Pagination, Grid, Message, Button, Icon } from "semantic-ui-react";
import "../policies/new-policy.component.css";
import LoaderComponent from "../utils/loader.component";
import DetailsAlertModal from "../details.alert.modal.component";
import {subscribeToNewNotificationEvents, unsubscribeFromNewNotificationEvents} from "../../util/web-socket"

import AlertUtil from '../../util/alert-util';

import "./list-notifications.component.css";
import EmptyComponent from "../utils/empty.component";
import DeleteNotificationModal from "../delete.notification.modal";

@inject("notificationStore", "globalConfigStore")
class ListNotificationsComponent extends React.Component {
  colors = AlertUtil.getColorsMap();

  subscriber = null;

  state = {
    hasError: false,
    isLoading: false,
    title: "EVENTS LOG",
    notifications: [],
    totalItems: null,
    totalPages: null,
    pagination: {
      page: 1,
      size: 50,
    },
    selectedAlert: null,
    newNotifications: false,
  };

  loadPage() {
    const { pagination, selectedAlert } = this.state;
    this.setState({ isLoading: true });
    this.props.notificationStore
      .query(pagination)
      .then(({ data, headers }) => {
        const notifications = data;
        const totalItems = headers["total-items"];
        const totalPages = headers["total-pages"];
        this.setState({
          isLoading: false,
          totalItems,
          totalPages,
          notifications,
        });

        if (selectedAlert) {
          if (selectedAlert.index === 0) {
            this.showAlertDetails(notifications.length - 1);
          } else if (selectedAlert.index < pagination.size) {
            this.showAlertDetails(0);
          }
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false, hasError: true });
        console.error("err", err);
      });
  }

  componentWillMount() {
    this.loadPage();
    this.subscriber = subscribeToNewNotificationEvents((event) => {
      this.setState({ newNotifications: true });
    });
  }

  reload = () => {
    const pagination = this.state;
    pagination.page = 1;
    this.setState({ pagination, newNotifications: false });
    this.loadPage();
  };

  componentWillUnmount() {
    unsubscribeFromNewNotificationEvents(this.subscriber);
  }

  handlePaginationChange = (e, { activePage }) => {
    let { pagination } = this.state;
    pagination.page = activePage;
    this.setState({ pagination });

    this.loadPage();
  };

  markAsRead = (index) => {
    const { notifications } = this.state;
    notifications[index].readAt = Date();
    this.props.notificationStore
      .update(notifications[index].id, { readAt: new Date().toISOString() })
      .then(() => {});
    this.setState({ notifications });
  };

  markAsUnread = (index) => {
    const { notifications } = this.state;
    notifications[index].readAt = null;
    this.props.notificationStore
      .update(notifications[index].id, { readAt: null })
      .then(() => {});
    this.setState({ notifications });
  };

  toggleRead = (index) => {
    const { notifications } = this.state;

    if (notifications[index].readAt) {
      notifications[index].readAt = null;
    } else {
      notifications[index].readAt = new Date().toISOString();
    }

    this.props.notificationStore
      .update(notifications[index].id, { readAt: notifications[index].readAt })
      .then(() => {
        this.setState({ notifications });
      });
  };

  handleDelete = () => {
    const { pagination } = this.state;
    pagination.page = 1;
    this.setState({ pagination });
    this.loadPage();
  };

  showAlertDetails = (index) => {
    const notification = this.state.notifications[index];

    this.setState({ notificationDetailsLoadingID: notification.id });

    const selectedAlert = {
      index,
      alert: notification.alert,
      alert_type: notification.alertType,
      isFirst: this.state.pagination.page === 1 && index === 0,
      isLast:
        this.state.pagination.page === this.state.totalPages &&
        index === this.state.notifications.length - 1,
    };

    this.setState({
      selectedAlert,
      notificationDetailsLoadingID: null,
    });
  };

  goToNotification = (direction) => {
    if (this.state.selectedAlert.index === 0 && direction < 0) {
      if (this.state.pagination.page > 1) {
        this.handlePaginationChange(null, {
          activePage: this.state.pagination.page - 1,
        });
      }

      return;
    }

    if (
      this.state.selectedAlert.index === this.state.notifications.length - 1 &&
      direction > 0
    ) {
      if (this.state.pagination.page < this.state.totalPages) {
        this.handlePaginationChange(null, {
          activePage: this.state.pagination.page + 1,
        });
      }

      return;
    }

    const newIndex = this.state.selectedAlert.index + direction;
    this.showAlertDetails(newIndex);
  };

  closeAlertDetails = () => {
    this.setState({ selectedAlert: null });
  };

  render() {
    const {
      title,
      notifications,
      isLoading,
      totalPages,
      pagination,
      hasError,
      notificationDetailsLoadingID,
      selectedAlert,
      newNotifications,
    } = this.state;
    const { page } = pagination;

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            <h1>{title}</h1>
            <div className="view-header-actions"></div>
          </div>
          <div className="view-body">
            <Table className="animated fadeIn" basic="very" compact="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>RISK</Table.HeaderCell>
                  <Table.HeaderCell>DESCRIPTION</Table.HeaderCell>
                  <Table.HeaderCell collapsing>DATE</Table.HeaderCell>
                  <Table.HeaderCell collapsing>ACTIONS</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {!hasError && !isLoading && notifications.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan="4">
                      <EmptyComponent emptyMessage="There are no events to show" />
                    </Table.Cell>
                  </Table.Row>
                )}
                {newNotifications && (
                  <Table.Row>
                    <Table.Cell
                      colSpan="4"
                      verticalAlign="middle"
                      style={{ textAlign: "center" }}
                    >
                      <Message info compact>
                        <Icon name="bell" />
                        There're new notificacions&nbsp;&nbsp;
                        <Button
                          circular
                          positive
                          size="mini"
                          icon="fas fa-sync"
                          onClick={this.reload}
                          content="Reload now"
                        />
                      </Message>
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isLoading &&
                  notifications.length > 0 &&
                  notifications.map((notification, index) => (
                    <Table.Row
                      textAlign="left"
                      key={index}
                      style={{ cursor: "pointer" }}
                    >
                      <Table.Cell
                        className="notifications-table-cell risk-column"
                        onClick={() => this.showAlertDetails(index)}
                      >
                        <Label
                          horizontal
                          style={{
                            backgroundColor: this.colors[
                              notification.alertType.risk
                            ],
                            color: "white",
                            borderWidth: 1,
                            borderColor: this.colors[
                              notification.alertType.risk
                            ],
                            width: "100px",
                          }}
                        >
                          {notification.alertType.risk}
                        </Label>
                      </Table.Cell>
                      <Table.Cell
                        className="notifications-table-cell"
                        onClick={() => {
                          this.markAsRead(index);
                          this.showAlertDetails(index);
                        }}
                      >
                        {notification.alertType.name}
                      </Table.Cell>
                      <Table.Cell
                        singleLine
                        className="notifications-table-cell created-column"
                      >
                        <Moment
                          format={
                            this.props.globalConfigStore.dateFormats.moment
                              .dateTimeFormat
                          }
                        >
                          {notification.createdAt}
                        </Moment>
                      </Table.Cell>
                      <Table.Cell className="notifications-table-cell wd-xl td-actions">
                        <Popup
                          trigger={
                            <button
                              disabled={
                                notification.id === notificationDetailsLoadingID
                              }
                              onClick={() => {
                                this.showAlertDetails(index);
                              }}
                            >
                              <i className="fas fa-eye" />
                            </button>
                          }
                        >
                          View alert
                        </Popup>
                        <Popup
                          trigger={
                            <button
                              onClick={() => {
                                this.toggleRead(index);
                              }}
                            >
                              <i
                                className={`${
                                  notification.readAt
                                    ? "far fa-envelope-open"
                                    : "fas fa-envelope"
                                }`}
                              />
                            </button>
                          }
                        >
                          {`${
                            notification.readAt
                              ? "Mark as unread"
                              : "Mark as read"
                          }`}
                        </Popup>
                        <DeleteNotificationModal
                          notification={notification}
                          handleNotificationRemoval={this.handleDelete}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            {isLoading && (
              <LoaderComponent loadingMessage="Loading events..." />
            )}
            {hasError && (
              <Message
                error
                header="Oops!"
                content={"Something went wrong. Try again later."}
                style={{ maxWidth: "100%" }}
              />
            )}
            <Grid className="segment centered">
              {totalPages > 1 && !isLoading && (
                <Pagination
                  className=""
                  activePage={page}
                  onPageChange={this.handlePaginationChange}
                  totalPages={totalPages}
                />
              )}
            </Grid>
            {selectedAlert && (
              <DetailsAlertModal
                loading={isLoading}
                alert={selectedAlert}
                showGoToAlerts={true}
                onClose={this.closeAlertDetails}
                onNavigate={this.goToNotification}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ListNotificationsComponent;