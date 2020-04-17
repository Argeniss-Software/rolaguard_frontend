import * as React from "react";
import { observer, inject } from "mobx-react";
import { Popup, Table, Message, Grid, Pagination } from "semantic-ui-react";
import LoaderComponent from "./utils/loader.component";
import DeleteUserModal from "../components/delete.user.modal.component";
import ResendActivationModal from "./resend_activation.modal.component";
import Validation from "../util/validation";

@inject("usersStore", "authStore", "rolesStore")
@observer
class UsersComponent extends React.Component {

  state = {
    hasError: false,
    recentlyRemoved: false,
    isLoading: false,
    title: 'USERS',
    users: [],
    totalItems: null,
    totalPages: null,
    pagination: {
      page: 1,
      size: 20  
    }
  }

  loadPage() {
    const { pagination } = this.state;
    this.setState({isLoading: true});

    const rolesPromise = this.props.rolesStore.getRolesApi();
    const usersPromise = this.props.usersStore.query(pagination)

    Promise.all([rolesPromise, usersPromise]).then(
      (response) => {
        const { data, headers } = response[1];

        const users = data.users;
        const totalItems = headers['total-items'];
        const totalPages = headers['total-pages'];
        this.setState({isLoading: false, totalItems, totalPages, users});
      },
      (err) => {
        this.setState({isLoading: false, hasError: true });
        console.error('err', err);
      }
    );
  }

  componentWillMount() {
    this.loadPage();
  }

  handlePaginationChange = (e, { activePage }) => {
    
    let { pagination } = this.state;
    pagination.page = activePage;
    this.setState({ pagination });

    this.loadPage();
  }

  handleDeleteSuccess = () => {
    this.loadPage();
  }

  render() {
    const { usersStore, history, rolesStore} = this.props;
    const { users, isLoading, totalPages, pagination, hasError } = this.state;
    const { page } = pagination;
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

    let headers = [
      {
        name: "USER NAME",
        visible: true
      },
      {
        name: "FULL NAME",
        visible: true
      },
      {
        name: "ROLES",
        visible: true
      },
      {
        name: "ACTIONS",
        visible: true
      }
    ];

    let headerToShow = headers.map((header, index) => {
      if (header.visible) {
        return (
          <Table.HeaderCell key={"header-" + index}>
            {header.name}
          </Table.HeaderCell>
        );
      }
    });

    let usersList = users.map((user, index) => {

      return (
        <Table.Row key={user.username + "-" + index}>
          <Table.Cell>{user.username}</Table.Cell>
          <Table.Cell>{user.full_name}</Table.Cell>
          <Table.Cell>{rolesStore.getRolesAsString(user)}</Table.Cell>
          <Table.Cell>
            <div className="td-actions">
              {/* VIEW BUTTON */}
              <Popup
                trigger={
                  <button
                    onClick={() =>
                      history.push("/dashboard/profile/" + user.username)
                    }>
                    <i className="fas fa-eye" />
                  </button>
                }
                content="View user"
              />
              {/* EDIT BUTTON */}
              {
                isAdmin && <Popup
                trigger={
                  <button
                    onClick={() =>
                      history.push("/dashboard/users/" + user.username)
                    }>
                    <i className="fas fa-edit" />
                  </button>
                }
                content="Edit user"
              />
              }

              {/* DELETE BUTTON */}
              {user.username !== usersStore.currentUser.username && (
                <DeleteUserModal user={user} onSuccess={() => {this.handleDeleteSuccess()}} />
              )}

              {/* RESEND ACTIVATION BUTTON */}
              {!user.active && (
                <ResendActivationModal user={user} />
              )}
            </div>
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            {/* HEADER TITLE */}
            <h1>USER LIST</h1>

            {/* HEADER ACTIONS */}
            { isAdmin &&
            <div className="view-header-actions">
              <div onClick={() => history.push("/dashboard/users/new")}>
                <i className="fas fa-plus" />
                <span>NEW USER</span>
              </div>
            </div>
            }
          </div>

          {/* VIEW BODY */}
          <div className="view-body">
            {this.state.isLoading && (
              <LoaderComponent loadingMessage="Loading users..." />
            )}
            {!this.state.isLoading && (
              <Table className="animated fadeIn" basic="very" compact="very">
                <Table.Header>
                  <Table.Row>{headerToShow}</Table.Row>
                </Table.Header>
                <Table.Body>{usersList}</Table.Body>
              </Table>
            )}
            { hasError && 
              <Message error header='Oops!' content={'Something went wrong. Try again later.'} style={{maxWidth: '100%'}}/>
            }
            <Grid className="segment centered">
              { totalPages > 1 && !isLoading &&
                <Pagination className="" activePage={page} onPageChange={this.handlePaginationChange} totalPages={totalPages} />
              }
            </Grid>

          </div>
        </div>
      </div>
    );
  }
}

export default UsersComponent;
