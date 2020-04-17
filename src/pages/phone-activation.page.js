import * as React from "react";
import { inject } from "mobx-react";
import { Grid, Header, Form, Segment, Divider, Loader, Icon } from "semantic-ui-react";

import logo from '../img/rolaguard-logo-white.svg'
import BackToLogin from "../components/utils/back-to-login.component";

@inject("notificationStore")
class PhoneActivation extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        result: 'NOT_FOUND',
        title: 'SMS activation',
        phone: '',
        logoURL: logo
      }
    }

    componentWillMount() {
        const token = this.props.match.params.token;
        this.props.notificationStore.activatePhone(token).then(
            res => this.setState({ phone: res.data.phone, isLoading: false, result: 'SUCCESS' })
        ).catch(
            err => {
                if(err.response.status === 404) {
                    this.setState({ isLoading: false, result: 'NOT_FOUND' });
                } else {
                    this.setState({ isLoading: false, result: err.response.data.code });
                }
            }
        );
    }

    render() {
        const { isLoading, result, title, phone } = this.state;
    
        return (
          <div
            className="login-form"
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            >
            <Grid textAlign="center" style={{ margin: 0, height: "100%" }} verticalAlign="middle">
              <Grid.Column className="animated fadeIn" style={{ maxWidth: 800 }}>
                <Header as="h2" inverted color="black" textAlign="center">
                  <img id="login-logo" className="animated fadeIn" src={this.state.logoURL} alt=""/>
                </Header>
                <Form size="large">
                    <Segment style={{minHeight: 300}}>
                        <Header as="h1">{title}</Header>
                        <Divider />
                        {isLoading &&
                            <div style={{marginTop: 80}}>
                                <Loader active inline='centered' size='massive'/>
                            </div>
                        }
                        {!isLoading && result === 'SUCCESS' &&
                            <div style={{marginTop: 25}}>
                                <Icon size='massive' name='check circle' color='green' />
                                <h3>The phone {phone} has been activated successfully</h3>
                            </div>
                        }
                        {!isLoading && (result === 'NOT_FOUND' ||  result === 'DISABLED_TOKEN') &&
                            <div style={{marginTop: 25}}>
                                <Icon size='massive' name='dont' color='red' />
                                <h3>This token doesn't exist or has expired</h3>
                            </div>
                        }
                        {!isLoading && (result === 'PHONE_ALREADY_ACTIVE') &&
                            <div style={{marginTop: 25}}>
                                <Icon size='massive' name='warning circle' color='yellow' />
                                <h3>That phone was activated previously</h3>
                            </div>
                        }
                        <BackToLogin/>
                    </Segment>
                </Form>
              </Grid.Column>
            </Grid>
          </div>
        );
      }    
}

export default PhoneActivation