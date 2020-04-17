import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Label,
  Message
} from "semantic-ui-react";
import "./login.page.css";
import Validation from "../util/validation";

import logo from '../img/rolaguard-logo-white.svg'
import BackToLogin from "../components/utils/back-to-login.component";

@inject("authStore", "usersStore")
@observer
class PasswordCreatePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      formHasError: true,
      showErrors: {
        password: false,
        password2: false,
        passwordsMatch: false,
        errorMessage: null,
        invalidToken: false
      },
      user: {
        password: "",
        password2: "",
        token: props.match.params.token
      },
      showSuccess: false,
      title: "",
      text: "",
      logoURL: logo,
      action:
        props.match.path === "/change_password/:token"
          ? "change_password"
          : "activation"
    };
  }

  handleChange = (e, { name, value }) => {
    let user = this.state.user;
    let showErrors = this.state.showErrors;

    user[name] = value;
    showErrors[name] = false;
    showErrors.passwordsMatch = false;

    this.setState({
      user: user,
      showErrors: showErrors
    });
  };

  validateForm = () => {
    let showErrors = this.state.showErrors;
    let user = this.state.user;
    let formHasError = this.state.formHasError;

    showErrors.password = !Validation.isValidPassword(user.password);
    showErrors.password2 = !Validation.isValidPassword(user.password2);
    showErrors.passwordsMatch = user.password !== user.password2 ? true : false;

    formHasError =
      showErrors.password || showErrors.password2 || showErrors.passwordsMatch;

    this.setState({ showErrors: showErrors, formHasError: formHasError });
    return formHasError;
  };

  save = e => {
    let error = this.validateForm();
    let showErrors = this.state.showErrors;

    if (!error) {
      this.setState({ loading: true });

      if (this.state.action === "activation") {
        this.props.usersStore
          .createPassword(this.state.user)
          .then(response => {
            if (response.status !== 200) {
              showErrors.invalidToken = true;
              showErrors.errorMessage= response.data.error;
              this.setState({
                loading: false,
                showErrors: showErrors,
                showSuccess: false,
              });
            } else {  
              this.setState({
                loading: false,
                showSuccess: true,
              });
            }
          })
          .catch(error => {
            console.log("error", error);
            this.setState({ loading: false });
            return error.response;
          });
      } else if (this.state.action === "change_password") {
        this.props.usersStore
          .changePasswordByRecovery(this.state.user)
          .then(response => {
            if (response.status !== 200) {
              showErrors.invalidToken = true;
              this.setState({
                loading: false,
                showErrors: showErrors,
                showSuccess: false
              });
            } else {
              this.setState({
                loading: false,
                showSuccess: true
              });
            }
          })
          .catch(error => {
            console.log("error", error);
            this.setState({ loading: false });
            return error.response;
          });

      }
    }
  };

  render() {
    const { loading, loginError, user, showSuccess } = this.state;
    const { invalidToken } = this.state.showErrors;
    const { errorMessage } = this.state.showErrors;

    return (
      <div
        className="login-form"
        style={{
          display: "flex",
          justifyContent: "center"
        }}>
        >
        <Grid
          textAlign="center"
          style={{ margin: 0, height: "100%", width: "40%" }}
          verticalAlign="middle">
          <Grid.Column className="animated fadeIn" style={{ maxWidth: 800 }}>
            <Header as="h2" inverted color="black" textAlign="center">
              <img id="login-logo" className="animated fadeIn" src={this.state.logoURL} alt=""/>
            </Header>
            <Form size="large" error={loginError}>
              {!showSuccess && !invalidToken && (
                <Segment>
                  <Form.Group>
                    <Form.Field style={{ width: "100%" }} required>
                      <label> Password </label>
                      <Form.Input
                        placeholder="Password"
                        name="password"
                        value={user.password}
                        type="password"
                        onChange={this.handleChange}
                        error={this.state.showErrors.password}
                        fluid
                      />
                      {this.state.showErrors.password && (
                        <Label basic color="red" pointing>
                          At least eight characters, an uppercase, a lowercase,
                          a number and a special character
                        </Label>
                      )}
                    </Form.Field>
                  </Form.Group>
                  <Form.Group>
                    <Form.Field style={{ width: "100%" }} required>
                      <label> Repeat Password </label>
                      <Form.Input
                        placeholder="Repeat Password"
                        name="password2"
                        value={user.password2}
                        type="password"
                        onChange={this.handleChange}
                        error={
                          this.state.showErrors.password2 ||
                          this.state.showErrors.passwordsMatch
                        }
                        style={{ width: "100%" }}
                      />
                      {this.state.showErrors.passwordsMatch && (
                        <Label basic color="red" pointing>
                          Passwords do not match
                        </Label>
                      )}
                    </Form.Field>
                  </Form.Group>
                  <BackToLogin/>
                  <Button
                    color="blue"
                    size="large"
                    onClick={() => this.save()}
                    loading={loading}
                    disabled={
                      loading ||
                      Validation.isEmpty(user.password) ||
                      Validation.isEmpty(user.password2)
                    }>
                    Save Password
                  </Button>
                </Segment>
              )}
              {showSuccess && (
                <Segment>
                  <Message className="mh-auto" color='green'>Your password has been updated. You can login with your account now.</Message>
                </Segment>
              )}
              {errorMessage && (
                <Segment>
                  <Message className="mh-auto" color='red'>{errorMessage}</Message>
                </Segment>
              )}
              {invalidToken && !errorMessage && (
                <Segment>
                  <Message className="mh-auto" color='red'>We are sorry, the token is invalid. Please contact support.</Message>
                </Segment>
              )}
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default PasswordCreatePage;
