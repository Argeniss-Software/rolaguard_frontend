import * as React from "react";
import { observer, inject } from "mobx-react";
import { Grid, Header, Form, Segment, Loader, Divider, Message } from "semantic-ui-react";
import "./login.page.css";

import logo from '../img/rolaguard-logo-white.svg'
import BackToLogin from '../components/utils/back-to-login.component'

@inject("authStore", "usersStore")
@observer
class EmailChange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: {
        token: props.match.params.token
      },
      changeOK: false,
      logoURL: logo
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.props.usersStore
      .confirmEmailChange(this.state.user)
      .then(response => {
        if (response.status !== 200) {
          this.setState({
            loading: false,
            changeOK: false
          });
        } else {
          this.setState({
            loading: false,
            changeOK: true
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
          changeOK: false
        });
      });
  }

  render() {
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
            <Form size="large" error={this.state.recoverError}>
              <Segment>
                <Header as="h1">Email change</Header>
                <Divider></Divider>
                <Loader inline='centered' active={this.state.loading === true}>Updating email</Loader>
                {!this.state.changeOK && !this.state.loading && (
                  <Message color='red'>We are sorry. Your e-mail could not be updated.</Message>
                )}
                {this.state.changeOK && !this.state.loading && (
                  <Message color='green'>Your e-mail has been successfully updated.</Message>
                )}
                <BackToLogin/>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default EmailChange;
