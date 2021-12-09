import * as React from "react";
import { inject } from "mobx-react";
import {
  Table,
  Popup,
  Label,
  Pagination,
  Grid,
  Message,
  Header,
} from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";
import "./new-policy.component.css";
import DeletePolicyModal from "./delete-policy.component";
import NewSimplifiedPolicy from "./new-simplified-policy.component";
import Validation from "../../util/validation";

@inject("policyStore", "usersStore")
class ListPoliciesComponent extends React.Component {
  state = {
    hasError: false,
    recentlyRemoved: false,
    isLoading: false,
    title: "POLICIES",
    policies: [],
    totalItems: null,
    totalPages: null,
    pagination: {
      page: 1,
      size: 20,
    },
  };

  loadPage() {
    const { pagination } = this.state;
    this.setState({ isLoading: true });
    this.props.policyStore
      .query(pagination)
      .then(({ data, headers }) => {
        const policies = data;
        const totalItems = headers["total-items"];
        const totalPages = headers["total-pages"];
        this.setState({ isLoading: false, totalItems, totalPages, policies });
      })
      .catch((err) => {
        this.setState({ isLoading: false, hasError: true });
        console.error("err", err);
      });
  }

  componentDidMount() {
    this.loadPage();
  }

  handlePaginationChange = (e, { activePage }) => {
    let { pagination } = this.state;
    pagination.page = activePage;
    this.setState({ pagination });

    this.loadPage();
  };

  callbackConfirm = () => {
    const { pagination } = this.state;
    pagination.page = 1;
    this.setState({ pagination });
    this.loadPage();
  };

  render() {
    const {
      title,
      policies,
      isLoading,
      totalPages,
      pagination,
      hasError,
      recentlyRemoved,
    } = this.state;
    const { page } = pagination;
    const { history } = this.props;

    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            <h1>{title}</h1>
            <div className="view-header-actions">
              {isAdmin && (
                <div onClick={() => history.push("/dashboard/policies/new")}>
                  <i className="fas fa-plus" />
                  <span>NEW POLICY</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <Header
              as="h5"
              style={{ marginTop: "0.5em", marginBottom: "0.8em" }}
            >
              The "default policy" cannot be edited. For a personalized
              configuration, you can create a new policy with the new policy
              button or clone the default policy and then edit it
            </Header>
          </div>
          <div className="view-body">
            {recentlyRemoved && (
              <Message
                success
                icon="check"
                content="The policy has been removed!"
              />
            )}
            {!hasError && !isLoading && policies.length === 0 && (
              <h3 style={{ textAlign: "center" }}>No registered policies.</h3>
            )}

            {isLoading && (
              <LoaderComponent loadingMessage="Loading policies..." />
            )}
            {!isLoading && policies.length > 0 && (
              <Table className="animated fadeIn" basic="very" compact="very">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>NAME</Table.HeaderCell>
                    <Table.HeaderCell>DATA SOURCES</Table.HeaderCell>
                    <Table.HeaderCell>ACTIONS</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {policies.map((policy) => (
                    <Table.Row key={policy.id}>
                      <Table.Cell>{policy.name}</Table.Cell>
                      <Table.Cell>
                        {policy.dataCollectors.length > 0 ? (
                          policy.dataCollectors.map((dc) => (
                            <Label key={dc.name} horizontal>
                              {dc.name}
                            </Label>
                          ))
                        ) : (
                          <i>None</i>
                        )}
                      </Table.Cell>
                      <Table.Cell className="wd-xl">
                        <div className="td-actions">
                          <Popup
                            trigger={
                              <button
                                onClick={() => {
                                  history.push(
                                    `/dashboard/policies/${policy.id}/view`,
                                    { policy }
                                  );
                                }}
                              >
                                <i className="fas fa-eye" />
                              </button>
                            }
                            content="View policy"
                          />
                          {isAdmin && (
                            <NewSimplifiedPolicy
                              policy={policy}
                              callback={this.callbackConfirm}
                            />
                          )}
                          {isAdmin && !policy.isDefault && (
                            <Popup
                              trigger={
                                <button
                                  onClick={() =>
                                    history.push(
                                      `/dashboard/policies/${policy.id}/edit`
                                    )
                                  }
                                >
                                  <i className="fas fa-edit" />
                                </button>
                              }
                              content="Edit policy"
                            />
                          )}
                          {isAdmin && !policy.isDefault && (
                            <DeletePolicyModal
                              policy={policy}
                              onConfirm={this.callbackConfirm}
                            />
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
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
          </div>
        </div>
      </div>
    );
  }
}

export default ListPoliciesComponent;
