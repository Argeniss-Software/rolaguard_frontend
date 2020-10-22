import jwtDecode from "jwt-decode";
import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Grid,
  Header,
  Form,
  Segment,
  Message,
  Button
} from "semantic-ui-react";
import "./login.page.css";

import logo from '../img/rolaguard-logo-white.svg'

@inject("authStore")
@observer
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.toPasswordRecovery = this.toPasswordRecovery.bind(this);
    this.toRegister = this.toRegister.bind(this);
    
    this.state = {
      loading: false,
      loginError: false,
      username: "",
      password: "",
      errorHeader: "",
      errorText: "",
      logoURL: logo,
      showPasswordUpdatedMsg: false
    };
  }


    componentDidMount() {
      if (_.get(this, 'props.location.state.successSetPassword', false) === "true") {
        this.state.showPasswordUpdatedMsg = true
      } else {
        this.state.showPasswordUpdatedMsg = false
      }
        
    }

  login = () => {
    const userData = {
      username: this.state.username.trim(),
      password: this.state.password
    };
    this.setState({ loginError: false, loading: true });

  
    this.props.authStore.login(userData).then((response) => {
      if (response.status !== 200) {

        this.setState({
          loginError: true,
          loading: false,
          errorHeader: "Login Error",
          errorText: "Username or password is incorrect",

        });      

      } else {
        const parsedToken = jwtDecode(response.data.access_token);
        this.props.authStore.setUser({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          username: parsedToken.identity
        });
        this.setState({ loading: false });
        this.props.history.push("/dashboard");
      }
    });
  };

  toPasswordRecovery = () => {
    this.props.history.push("/recovery");
  }

  toRegister = () => {
    this.props.history.push("/register");
  }

  render() {
    const {
      loading,
      loginError,
      errorHeader,
      errorText
    } = this.state;

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ margin: 0, height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column className="animated fadeIn" style={{ maxWidth: 450 }}>
            <Header as="h2" inverted color="black" textAlign="center">
              <img
                id="login-logo"
                className="animated fadeIn"
                src={this.state.logoURL}
                alt=""
              />
            </Header>
            {this.state.showPasswordUpdatedMsg && (
              <Segment>
                <Message className="mh-auto" color="green">
                  Your password has been updated. You can login with your
                  account now.
                </Message>
              </Segment>
            )}

            <Form
              className="form-label form-css-label"
              size="large"
              error={loginError}
            >
              <Segment>
                <Form.Input
                  fluid
                  name="user"
                  autoComplete="off"
                  required
                  onChange={(e, data) =>
                    this.setState({ username: data.value, loginError: false })
                  }
                >
                  <input />
                  <label>Username or email</label>
                </Form.Input>

                <Form.Input
                  fluid
                  type="password"
                  required
                  onChange={(e, data) =>
                    this.setState({ password: data.value, loginError: false })
                  }
                >
                  <input />
                  <label>Password</label>
                </Form.Input>
                {this.state.loginError && (
                  <Message error header={errorHeader} content={errorText} />
                )}
                <Button
                  color="blue"
                  fluid
                  size="large"
                  onClick={this.login}
                  loading={loading}
                  style={{ marginBottom: 10 }}
                  disabled={
                    loading || !this.state.password || !this.state.username
                  }
                >
                  Login
                </Button>
                <a
                  onClick={this.toPasswordRecovery}
                  className="cursor-pointer"
                  style={{ marginBottom: "2em" }}
                >
                  Forgot password?
                </a>
                <br />
              </Segment>
            </Form>
            <Message>
              Don't you have an account?{" "}
              <a onClick={this.toRegister} className="cursor-pointer">
                Sign Up
              </a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginPage;
