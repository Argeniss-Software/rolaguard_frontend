import React, { Component } from "react";
import { Button, Form, Label } from "semantic-ui-react";
import Validation from "../../util/validation";
import { observer, inject } from "mobx-react";

@inject("usersStore", "authStore", "messageStore")
@observer
export default class EmailAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: {
        current_password: "",
        email: props.usersStore.currentUser.email
      },
      changeOK: false,
      showErrors: {
        password: false,
        email: false,
        sameEmail: false,
        emailNotAvailable: false,
        wrongPassword: false
      },
      formHasError: true
    };
  }

  handleChange = (e, { name, value }) => {
    let user = this.state.user;
    let showErrors = this.state.showErrors;

    user[name] = value;

    for (let key in showErrors) {
      showErrors[key] = false;
    }

    this.setState({
      user: user,
      showErrors: showErrors
    });
  };

  validateForm = () => {
    let showErrors = this.state.showErrors;
    let user = this.state.user;
    let formHasError = this.state.formHasError;

    user.email = user.email.trim();

    showErrors.sameEmail = this.props.usersStore.currentUser.email === user.email ? true : false;
    showErrors.emailTooLong = Validation.exceedsEmailLength(user.email);

    formHasError = showErrors.sameEmail || showErrors.emailTooLong ? true : false;

    this.setState({ showErrors: showErrors, formHasError: formHasError });

    return formHasError;
  };

  save = e => {
    e.preventDefault();
    let error = this.validateForm();
    let showErrors = this.state.showErrors;

    if (!error) {
      this.setState({ loading: true });
      this.props.usersStore.changeEmailRequest(this.state.user).then(response => {
        if (response.status !== 200) {
          if (response.data.error === "Email " + this.state.user.email + " is not available") {
            showErrors.emailNotAvailable = true;
            this.setState({ showErrors: showErrors, loading: false });
          } else if (response.data.error === "Current password is wrong") {
            showErrors.wrongPassword = true;
            this.setState({ showErrors: showErrors, loading: false });
          } else if (response.data.error === "Email " + this.state.user.email + " is not valid") {
            showErrors.emailNotValid = true;
            this.setState({ showErrors: showErrors, loading: false });
          }

          this.setState({ loading: false, changeOK: false, showErrors: showErrors });
        } else {
          this.props.usersStore.currentUser.email = this.state.user.email;
          this.setState({
            loading: false,
            changeOK: true
          });
        }
      });
    }
  };

  render() {
    const { loading, showErrors, user, changeOK } = this.state;
    const hideSave = (Validation.isEmpty(user.current_password) ||
      Validation.isEmpty(user.email));

    return (
      <Form className="form-label form-css-label text-center" noValidate="novalidate">
        <Form.Field style={{ marginTop: "10px" }} required>
          <Form.Input
            required
            name="email"
            value={user.email}
            type="text"
            onChange={this.handleChange}
            error={showErrors.email}
          >
            <input/>
            <label>Email</label>
          </Form.Input>
          {showErrors.sameEmail && (
            <Label className="mt0" basic color="red" pointing>
              New e-mail cannot be the same as the current one.
            </Label>
          )}
          {showErrors.emailNotAvailable && (
            <Label className="mt0" basic color="red" pointing>
              We are sorry. The email address you entered is already in use.
            </Label>
          )}
          {showErrors.emailTooLong && (
            <Label className="mt0" basic color="red" pointing>
              Email is too long. Please enter a maximum of 320 characters.
            </Label>
          )}
          {showErrors.emailNotValid && (
            <Label className="mt0" basic color="red" pointing>
              Please enter a valid email address.
            </Label>
          )}
        </Form.Field>

        <Form.Field style={{ marginTop: "10px" }}  required>
          <Form.Input
            required
            name="current_password"
            value={user.current_password}
            type="password"
            onChange={this.handleChange}
            autoComplete="new-password"
          >
            <input/>
            <label>Current password</label>
          </Form.Input>
        </Form.Field>
        {showErrors.wrongPassword && (
          <Label className="mt0" basic color="red" pointing>
            Current password is wrong
          </Label>
        )}
        {!changeOK && (
          <Form.Field style={{
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <Button
              positive
              content="Save email"
              onClick={this.save}
              loading={this.state.loading}
              disabled={loading || hideSave}
            />
          </Form.Field>
        )}
        {changeOK && (
          <Label className="mt0" basic color='green'>Your change email request was successful. Please check your email for further instructions.</Label>
        )}
      </Form>
    );
  }
}
