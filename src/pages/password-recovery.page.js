import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Grid,
  Header,
  Form,
  Segment,
  Message,
  Button,
  Divider
} from "semantic-ui-react";
import "./login.page.css";
import Validation from "../util/validation";
import RecaptchaComponent from "../components/utils/recaptcha.component";

import logo from '../img/rolaguard-logo-white.svg'
import BackToLogin from "../components/utils/back-to-login.component";

@inject("authStore", "usersStore")
@observer
class PasswordRecoveryPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      recoverError: false,
      user:{
        email: ""
      },
      showMessage: false,
      errorHeader: "",
      errorText: "",
      logoURL: logo
    };
  }

  handleChange = (e, { name, value }) => {
    let user = this.state.user;
    user[name] = value;
   
    this.setState({
      user: user,
      recoverError: false
    });
  };

  sendRecoveryMail() {
    // let recaptchaOK = this.props.authStore.recaptchaOK;

    // if (recaptchaOK) {
      this.setState({ loading: true });

      this.state.user.email = this.state.user.email.trim();

      this.props.usersStore
        .recoverPassword(this.state.user, this.props.authStore.recaptcha_token)
        .then(response => {
          this.setState({
            loading: false,
            showMessage: true
          });
        })
        .catch(error => {
          this.setState({ loading: false });
          return error.response;
        });

      this.setState({ showMessage: true });
  }

  render() {
    const {
      loading,
      recoverError,
      showMessage,
      errorHeader,
      errorText,
      user
    } = this.state;

    const hideSave = Validation.isEmpty(user.email) || !this.props.authStore.recaptcha_token;

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ margin: 0, height: "100%" }}
          verticalAlign="middle">
          <Grid.Column className="animated fadeIn" style={{ maxWidth: 450 }}>
            <Header as="h2" inverted color="black" textAlign="center">
              <img id="login-logo" className="animated fadeIn" src={this.state.logoURL} alt=""/>
            </Header>
            <Form className="form-label form-css-label" size="large" error={recoverError}>
              {!showMessage && (
                <Segment>
                  <Form.Field>
                    <Form.Input
                      fluid
                      name="email"
                      required
                      onChange={this.handleChange}
                    >
                      <input/>
                      <label>Username or email</label>
                    </Form.Input>
                  </Form.Field>
                  <div className="recaptcha-component">
                    <RecaptchaComponent />
                  </div>
                  <BackToLogin />
                  <Button
                    color="blue"
                    size="large"
                    onClick={() => this.sendRecoveryMail()}
                    loading={loading}
                    disabled={loading || hideSave}>
                    Recover Password
                  </Button>
                  {this.state.recoverError && (
                    <div
                    style={{
                      display: "flex",
                      justifyContent: "center"
                    }}>                  
                      <Message error header={errorHeader} content={errorText} />
                      </div>
                  )}
                </Segment>
              )}
              {showMessage && (
                <Segment>
                  <Header as="h1">Email Sent</Header>
                  <Divider /> A recovery e-mail has been sent to{" "}
                  {user.email} with instructions on how to reset your
                  password. If you do not receive the recovery message within a
                  few minutes, please check your Spam E-mail folder.
                </Segment>
              )}
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default PasswordRecoveryPage;
