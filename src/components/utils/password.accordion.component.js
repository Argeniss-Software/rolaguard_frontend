import React, { Component } from "react";
import { Button, Form, Label } from "semantic-ui-react";
import Validation from "../../util/validation";
import { observer, inject } from "mobx-react";

@inject("usersStore", "messageStore")
@observer
export default class PasswordAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changeOK: false,
      loading: false,
      user: {
        current_password: "",
        password: "",
        password2: ""
      },
      showErrors: {
        password: false,
        password2: false,
        passwordsMatch: false,
        samePassword: false,
        currentPasswordWrong: false
      }
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

    showErrors.password = !Validation.isValidPassword(user.password);
    showErrors.password2 = !Validation.isValidPassword(user.password2);
    showErrors.passwordsMatch = user.password !== user.password2 ? true : false;
    showErrors.samePassword =
      user.current_password === user.password ? true : false;

    let formHasError =
      showErrors.password ||
      showErrors.password2 ||
      showErrors.passwordsMatch ||
      showErrors.samePassword;

    this.setState({ showErrors: showErrors });

    return formHasError;
  };

  savePassword = e => {
    e.preventDefault();
    let error = this.validateForm();
    let showErrors = this.state.showErrors;

    if (!error) {
      this.setState({ loading: true });
      this.props.usersStore.changePassword(this.state.user).then(response => {
        if (response.status !== 200) {
          showErrors.currentPasswordWrong = true;
          this.setState({ loading: false, showErrors: showErrors });
        } else {
          this.setState({ loading: false, changeOK: true });
        }
      });
    }
  };

  render() {
    const { loading, showErrors, user, changeOK } = this.state;

    return (
      <Form className="form-label form-css-label text-center">
        <Form.Field>
          <Form.Group
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column"
            }}>
            <Form.Field style={{ marginTop: "10px" }} required>
              <Form.Input
                required
                name="current_password"
                value={user.current_password}
                type="password"
                onChange={this.handleChange}
                error={showErrors.currentPasswordWrong}
              >
                <input/>
                <label>Current Password</label>
              </Form.Input>
            </Form.Field>
            {showErrors.currentPasswordWrong && (
              <Label basic color="red" pointing>
                Current password is wrong
              </Label>
            )}

            <Form.Field style={{ marginTop: "10px" }} required>
              <Form.Input
                required
                name="password"
                value={user.password}
                type="password"
                onChange={this.handleChange}
                error={showErrors.password}
              >
                <input/>
                <label>New password</label>
              </Form.Input>
              {showErrors.password && (
                <Label basic color="red" pointing>
                  At least eight characters, an uppercase, a lowercase, a
                  number and a special character. White spaces are not
                  allowed.
                </Label>
              )}
              {showErrors.samePassword &&
                !showErrors.password && (
                  <Label basic color="red" pointing>
                    New password cannot be the same as current one
                  </Label>
                )}
            </Form.Field>

            <Form.Field style={{ marginTop: "10px" }} required>
              <Form.Input
                required
                name="password2"
                value={user.password2}
                type="password"
                onChange={this.handleChange}
                error={showErrors.password2 || showErrors.passwordsMatch}
              >
                <input/>
                <label>Repeat new password</label>
              </Form.Input>
              {showErrors.passwordsMatch && (
                <Label basic color="red" pointing>
                  Passwords do not match
                </Label>
              )}
            </Form.Field>
            <Form.Field style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end"
            }}>
              <Button
                positive
                content="Save Password"
                onClick={this.savePassword}
                loading={this.state.loading}
                disabled={
                  loading ||
                  (Validation.isEmpty(user.current_password) ||
                    Validation.isEmpty(user.password) ||
                    Validation.isEmpty(user.password2))
                }
              />
            </Form.Field>
          </Form.Group>
        </Form.Field>
        {changeOK && (
          <Label className="mt0" basic color='green'>Your password has been successfully changed.</Label>
        )}
      </Form>
    );
  }
}
