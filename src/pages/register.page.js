import * as React from "react";
import { Grid } from "semantic-ui-react";
import "./login.page.css";
import { observer, inject } from "mobx-react";
import { Header, Segment, Form, Label, Button, Message } from "semantic-ui-react";
import Validation from "../util/validation";

import RecaptchaComponent from "../components/utils/recaptcha.component";
import PhoneComponent from "../components/utils/phone.component";
import BackToLogin from "../components/utils/back-to-login.component"

import logo from '../img/rolaguard-logo-white.svg'

@inject("usersStore", "messageStore", "authStore", "rolesStore")
@observer
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "",
        email: "",
        full_name: "",
        phone: ""
      },
      formHasError: true,
      loading: false,
      showErrors: {},
      showSuccessMessage: false,
      logoURL: logo
    };

    this.resetErrors();
  }

  resetErrors() {
    this.setState({
      showErrors: {
        full_name: false,
        username: false,
        usernameExists: false,
        emailExists: false,
        email: false,
        usernameHasWhiteSpaces: false,
        unknownError: false,
        bad_recaptcha_token: false
      }
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
    showErrors.fullNameTooLong = Validation.exceedsFullNameLength(user.full_name);
    showErrors.emailTooLong = Validation.exceedsEmailLength(this.state.user.email);

    formHasError = formHasError || showErrors.username || showErrors.usernameInvalid || showErrors.fullNameTooLong || showErrors.emailTooLong ? true : false;

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
      showErrors: showErrors
    });
  };

  handleSubmit = () => {
    let showErrors = this.state.showErrors;
    let errors = this.validateForm();

    if (!errors) {
      this.setState({ loading: true });

      this.props.usersStore.register(this.state.user,this.props.authStore.recaptcha_token).then((response) => {
        this.setState({ loading: false });

        if (response.status !== 200) {
          if (response.data.error === "User " + this.state.user.username + " already exists") {
            showErrors.usernameExists = true;
          } else if (response.data.error === "User " + this.state.user.username + " is not valid") {
            showErrors.usernameInvalid = true;
          } else if (response.data.error === "Email " + this.state.user.email + " is not available") {
            showErrors.emailExists = true;
          } else if (response.data.error === "Bad recaptcha token") {
            showErrors.bad_recaptcha_token = true;
            this.setState({ showErrors: showErrors, loading: false });
          } else {
            showErrors.unknownError = true;
          }
          
          this.setState({ showErrors: showErrors });
        } else {
          this.setState({ showSuccessMessage: true });
        }
      });
    }
  };

  onPhoneChange = (phone) => {
    const user = this.state.user;
    user.phone = phone;

    this.setState({user: user});
  }

  render() {
    const { user, showSuccessMessage } = this.state;
    let hideSave = Validation.isEmpty(user.full_name) ||
          Validation.isEmpty(user.email) ||
          Validation.isEmpty(user.username) ||
          !this.props.authStore.recaptcha_token;

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ margin: 0, height: "100%" }}
          verticalAlign="middle">
          <Grid.Column className="animated fadeIn" style={{ maxWidth: 650 }}>
        {!showSuccessMessage && ( 
          <div>
          <Header as="h2" inverted color="black" textAlign="center">
            <img id="login-logo" className="animated fadeIn" src={this.state.logoURL} alt=""/>
          </Header>
          <Form noValidate="novalidate" className="form-label form-css-label" onSubmit={this.handleSubmit} style={{ marginTop: "2em" }} size="large"  >
            <Segment textAlign="center">
                <Form.Field required>
                  <Form.Input
                    disabled={this.state.typeForm === "Edit"}
                    name="username"
                    required
                    value={user.username}
                    onChange={this.handleChange}
                    error={this.state.showErrors.username}
                  >
                    <input/>
                    <label>Username</label>
                  </Form.Input>
                  {this.state.showErrors.usernameInvalid && (
                    <Label className="mt0" basic color="red" pointing>
                      Invalid username. Please enter at least 3 characters, a maximum of 32 characters, use only letters (a-z), numbers, periods or underscores. 
                    </Label>
                  )}
                  {this.state.showErrors.usernameExists && (
                    <Label className="mt0" basic color="red" pointing>
                      We are sorry, that username already exists.
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
                    <input/>
                    <label>Fullname</label>
                  </Form.Input>
                  {this.state.showErrors.fullNameTooLong && (
                    <Label className="mt0" basic color="red" pointing>
                      Full name is too long. Please enter a maximum of 64 characters.
                    </Label>
                  )}
                </Form.Field>

                <Form.Field required>
                  <Form.Input
                    required
                    name="email"
                    value={user.email}
                    onChange={this.handleChange}
                    disabled={this.state.typeForm === "Edit"}
                    error={this.state.showErrors.email}
                  >
                    <input/>
                    <label>E-Mail</label>
                  </Form.Input>
                  {this.state.showErrors.emailExists && (
                    <Label className="mt0" basic color="red" pointing>
                      We are sorry. That email already exists.
                    </Label>
                  )}
                  {this.state.showErrors.emailTooLong && (
                    <Label className="mt0" basic color="red" pointing>
                      Email is too long. Please enter a maximum of 320 characters.
                    </Label>
                  )}
                </Form.Field>
                <Form.Field>
                  <PhoneComponent onPhoneChange={this.onPhoneChange}></PhoneComponent>
                </Form.Field>

                <div className="recaptcha-component">
                  <RecaptchaComponent />
                </div>

                <BackToLogin />

                <Button 
                  type="submit"
                  color="blue"
                  size="large"
                  loading={this.state.loading}
                  disabled={this.state.loading || hideSave}
                  content="Register"
                />

            </Segment>
          </Form>
          </div> 
          )}

          {showSuccessMessage && (
            <Segment>
              <Message className="mh-auto" color='green'>{'An email was sent to the account provided'}</Message>
            </Segment>
          )}
          {this.state.showErrors.unknownError && (
            <Segment>
              <Message className="mh-auto" color='red'>We are sorry. It has been an error while trying to create your account.</Message>
            </Segment>
          )}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default RegisterPage;
