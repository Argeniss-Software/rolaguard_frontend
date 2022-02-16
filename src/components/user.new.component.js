import * as React from "react";
import { Route } from 'react-router-dom'
import { observer, inject } from "mobx-react";
import {
  Form,
  Label,
  Button,
} from "semantic-ui-react/dist/commonjs";
import Validation from "../util/validation";
import PhoneComponent from "./utils/phone.component";
import ForbiddenPage from '../pages/forbiddenPage.page';
import * as sanitizeHtml from "sanitize-html";
@inject("usersStore", "messageStore", "authStore", "rolesStore")
@observer
class UsersNewComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createOK: false,
      user: {
        username: "",
        email: "",
        full_name: "",
        phone: "",
        user_roles: "",
      },
      valueDropdown: [],
      formHasError: true,
      unknownError: false,
      showErrors: {
        full_name: false,
        username: false,
        usernameExists: false,
        usernameInvalid: false,
        emailExists: false,
        phoneNotValid: false,
      },
      loading: false,
      title: "NEW USER",
      roleList: [],
      roleListLoading: true,
      defaultRoles: [],
      showSuccessMessage: false,
    };

    let roleList = [];

    this.props.rolesStore.getRolesApi().then((response) => {
      response.map((role) => {
        roleList.push({
          key: role.id,
          text: role.role_name.replace("_", " "),
          value: role.id,
        });
      });
      this.setState({
        roleList: roleList,
        roleListLoading: false,
      });
    });
  }

  validateForm = () => {
    let showErrors = this.state.showErrors;
    let user = this.state.user;
    let formHasError = this.state.formHasError;

    formHasError = showErrors.full_name || showErrors.email;

    user.email = user.email.trim();
    user.username = user.username.trim();

    showErrors.usernameInvalid = !Validation.isValidUsername(user.username);
    showErrors.fullNameTooLong = Validation.exceedsFullNameLength(
      user.full_name
    );
    showErrors.emailTooLong = Validation.exceedsEmailLength(
      this.state.user.email
    );

    formHasError =
      formHasError ||
      showErrors.username ||
      showErrors.usernameInvalid ||
      showErrors.fullNameTooLong ||
      showErrors.emailTooLong
        ? true
        : false;

    this.setState({ showErrors: showErrors, formHasError: formHasError });
    return formHasError;
  };

  handleChange = ({ name, value }, ev) => {
    let user = this.state.user;
    let showErrors = this.state.showErrors;

    user[ev.name] = ev.value;

    showErrors[ev.name] = false;

    if (ev.name === "username") {
      showErrors.usernameExists = false;
      showErrors.usernameInvalid = false;
    }

    if (ev.name === "email") {
      showErrors.emailExists = false;
    }

    this.setState({
      user: user,
      showErrors: showErrors,
      unknownError: false,
    });
  };

  handleSubmit = () => {
    let showErrors = this.state.showErrors;
    let errors = this.validateForm();

    if (!errors) {
      this.setState({ loading: true });

      this.props.usersStore.saveUser(this.state.user).then((response) => {
        debugger;
        if (response.status !== 200) {
          sanitizeHtml(this.state.user.username, {
            allowedTags: [],
            disallowedTagsMode: "escape",
          });
          const username = sanitizeHtml(this.state.user.username, {
            allowedTags: [],
            disallowedTagsMode: "escape",
          });
          const email = sanitizeHtml(this.state.user.email, {
            allowedTags: [],
            disallowedTagsMode: "escape",
          });
          const phone = sanitizeHtml(this.state.user.phone, {
            allowedTags: [],
            disallowedTagsMode: "escape",
          });

          switch (response.data.message) {
            case `Email ${email} is not valid`:
              showErrors.emailExists = true;
              this.setState({ showErrors: showErrors, loading: false });
              break;
            case `User ${username} is not valid`:
              showErrors.usernameInvalid = true;
              this.setState({ showErrors: showErrors, loading: false });
              break;
            case `User ${username} already exists`:
              showErrors.usernameExists = true;
              this.setState({ showErrors: showErrors, loading: false });
              break;
            case `Phone ${phone} is not valid`:
              showErrors.phoneNotValid = true;
              this.setState({ showErrors: showErrors, loading: false });
              break;
            default:
              this.setState({ unknownError: true, loading: false });
              break;
          }
        } else {
          this.setState({ loading: false, createOK: true });
        }
      });
    }
  };
  
  onPhoneChange = (phone) => {
    const user = this.state.user;
    user.phone = phone;

    this.setState({ user: user });
  };

  render() {
    const { user, title, createOK, unknownError } = this.state;
    let hideSave;
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

    hideSave =
      Validation.isEmpty(user.full_name) ||
      Validation.isEmpty(user.username) ||
      Validation.isEmpty(user.email) ||
      user.user_roles === "";

    return (
      <div className="app-body-container-view">
        {isAdmin && (
          <div className="animated fadeIn animation-view dashboard">
            <div className="view-header">
              {/* HEADER TITLE */}
              <h1>{title}</h1>
            </div>

            {/* VIEW BODY CHECK IF USER IS ADMIN*/}
            <div className="view-body">
              <div>
                <Form
                  className="form-label form-css-label text-center"
                  onSubmit={this.handleSubmit}
                  noValidate="novalidate"
                  style={{ marginTop: "2em" }}
                >
                  <Form.Field required>
                    <Form.Input
                      required
                      name="username"
                      value={user.username}
                      onChange={this.handleChange}
                      error={this.state.showErrors.username}
                    >
                      <input />
                      <label>User Name</label>
                    </Form.Input>
                    {this.state.showErrors.usernameInvalid && (
                      <Label className="mt0" basic color="red" pointing>
                        Invalid User Name. Please enter at least 3 characters, a
                        maximum of 32 characters, use only letters (a-z),
                        numbers, periods or underscores.
                      </Label>
                    )}
                    {this.state.showErrors.usernameExists && (
                      <Label className="mt0" basic color="red" pointing>
                        We are sorry, that User Name already exists.
                      </Label>
                    )}
                  </Form.Field>
                  <Form.Field required>
                    <Form.Input
                      required
                      name="full_name"
                      value={user.full_name}
                      onChange={this.handleChange}
                      error={this.state.showErrors.full_name}
                    >
                      <input />
                      <label>Full Name</label>
                    </Form.Input>
                    {this.state.showErrors.fullNameTooLong && (
                      <Label className="mt0" basic color="red" pointing>
                        Full name is too long. Please enter a maximum of 64
                        characters.
                      </Label>
                    )}
                  </Form.Field>
                  <Form.Field required>
                    <div className="dropdown-label-wrapper">
                      <label className="dropdown-label">User role</label>
                      <Form.Dropdown
                        placeholder="Select user role"
                        name="user_roles"
                        selection
                        options={this.state.roleList}
                        value={user.user_roles}
                        onChange={this.handleChange}
                      />
                    </div>
                  </Form.Field>
                  <Form.Field>
                    <PhoneComponent
                      currentPhone={this.state.user.phone}
                      onPhoneChange={this.onPhoneChange}
                    ></PhoneComponent>
                  </Form.Field>
                  {this.state.showErrors.phoneNotValid && (
                    <Label className="mt0" basic color="red" pointing>
                      We are sorry, the phone is not valid
                    </Label>
                  )}
                  <div>
                    <Form.Field required>
                      <Form.Input
                        required
                        name="email"
                        value={user.email}
                        onChange={this.handleChange}
                        error={this.state.showErrors.email}
                      >
                        <input />
                        <label>E-Mail</label>
                      </Form.Input>
                    </Form.Field>
                    {this.state.showErrors.emailExists && (
                      <Label className="mt0" basic color="red" pointing>
                        We are sorry. The email address you entered is already
                        in use.
                      </Label>
                    )}
                    {this.state.showErrors.emailTooLong && (
                      <Label className="mt0" basic color="red" pointing>
                        Email is too long. Please enter a maximum of 320
                        characters.
                      </Label>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="reset"
                      disabled={this.state.loading}
                      content="Back"
                      style={{ marginTop: "25px" }}
                      onClick={() => {
                        this.props.history.goBack();
                      }}
                    />
                    <Button
                      type="submit"
                      color="green"
                      loading={this.state.loading}
                      disabled={this.state.loading || hideSave}
                      content="Save"
                      style={{ marginTop: "25px" }}
                    />
                  </div>
                  {createOK && (
                    <Label className="text-center mh-auto" basic color="green">
                      {
                        "The user has been successfully created. A link to activate the account has been emailed."
                      }{" "}
                    </Label>
                  )}
                  {unknownError && (
                    <Label className="text-center mh-auto" basic color="red">
                      We are sorry. It has been an error while trying to create
                      the user.
                    </Label>
                  )}
                </Form>
              </div>
            </div>
          </div>
        )}
        {/* SHOW FORBIDDEN ERROR */}
        {!isAdmin && <Route component={ForbiddenPage} />}
      </div>
    );
  }
}

export default UsersNewComponent;
