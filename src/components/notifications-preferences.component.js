import * as React from "react";
import { inject } from "mobx-react";
import { Input, Button, Form, Header, Checkbox, Accordion, Icon, Table, Message, Popup, Label, Grid} from "semantic-ui-react";
import LoaderComponent from "./utils/loader.component";
import PhoneComponent from "./utils/phone.component";
import WebhookInfoModal from "./webhook.info.modal.component";

import AlertUtil from '../util/alert-util';

import "./notifications-preferences.component.css";
import Validation from "../util/validation";
import ImportanceLabel from "./utils/importance-label.component";

@inject("notificationStore")
class NotificationsPreferencesComponent extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        activeIndex: 2,
        isLoading: false,
        isSaving: false,
        hasError: false,
        preferences: {},
        newEmail: '',
        newPhone: '',
        newWebhookUrl: '',
        newSecret: '',
        showWebhookInfo: false
      }

      this.colors = AlertUtil.getColorsMap();
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.props.notificationStore.getPreferences().then(
            ({data}) => {
                data.dataCollectors.sort((a, b) => {
                  if (a.dataCollector.name.toLowerCase() > b.dataCollector.name.toLowerCase()) {
                    return 1;
                  }
                  if (b.dataCollector.name.toLowerCase() > a.dataCollector.name.toLowerCase()) {
                    return -1;
                  }
                  return 0;
                })
                this.setState({preferences: data, isLoading: false});
            }
        ).catch(
            err => {
              this.setState({isLoading: false, hasError: true });
              console.error('err', err);
            }
        );

    }

    toggle = (section, index) => {
        const { preferences } = this.state;
        preferences[section][index].enabled = !preferences[section][index].enabled;
        this.setState({ preferences });
    }

    toggleDestination = destination => {
        const { preferences } = this.state;
        const item = preferences['destinations'].find(item => item.destination === destination);
        item.enabled = !item.enabled;
        this.setState({ preferences });
    }

    onAdditionalChange = (e, { name, value }) => {
        this.setState({[name]: value});
    }

    onAdditionalEmailAdded = () => {
        const { newEmail, preferences } = this.state;
        const emailItem = preferences.destinations.find(item => item.destination === 'email');
        emailItem.additional.push({active: false, email: newEmail});
        this.setState({newEmail: '', preferences});
    }

    onAdditionalPhoneAdded = () => {
        const { newPhone, preferences } = this.state;
        const smsItem = preferences.destinations.find(item => item.destination === 'sms');
        smsItem.additional.push({active: false, phone: newPhone});
        this.setState({newPhone: '', preferences});
    }

    onAdditionalWebhookAdded = () => {
      const { newWebhookUrl, newSecret, preferences } = this.state;
      const webhookItem = preferences.destinations.find(item => item.destination === 'webhook');
      webhookItem.additional.push({active: false, url: newWebhookUrl, secret: newSecret});
      this.setState({newWebhookUrl: '', newSecret:'', preferences});
    }

    removeEmail = index => {
        const { preferences } = this.state;
        const emailItem = preferences.destinations.find(item => item.destination === 'email');
        emailItem.additional.splice(index, 1);
        this.setState({ preferences });
    }

    removePhone = index => {
        const { preferences } = this.state;
        const smsItem = preferences.destinations.find(item => item.destination === 'sms');
        smsItem.additional.splice(index, 1);
        this.setState({ preferences });
    }

    removeWebhook = index => {
      const { preferences } = this.state;
      const webhookItem = preferences.destinations.find(item => item.destination === 'webhook');
      webhookItem.additional.splice(index, 1);
      this.setState({ preferences });
    }

    save = () => {
        this.setState({ isSaving: true});
        this.props.notificationStore.savePreferences(this.state.preferences).then(
            () => {
              this.setState({ isSaving: false, showMessage: true });
              //this.props.history.push('/dashboard/events_manager')
            }
          ).catch(err => {
            this.setState({ isSaving: false, hasError: true });
            console.error(err);
          });
    }

    handleAccordionClick = (e, titleProps) => {
      const { index } = titleProps
      const { activeIndex } = this.state
      const newIndex = activeIndex === index ? -1 : index
  
      this.setState({ activeIndex: newIndex })
    }

    onPhoneChange = (phone) => {
      this.setState({newPhone: phone});
    }

    closeWebhookInfo = () => {
      this.setState({ showWebhookInfo: false });
    };

    render() {
        const { isLoading, isSaving, hasError, preferences, newEmail, newPhone, activeIndex, showMessage, newWebhookUrl, newSecret, showWebhookInfo } = this.state;
        const { risks, dataCollectors, destinations, asset_importance} = preferences;
        let emailItem = null, smsItem = null, pushItem, webhookItem=null;
        if(destinations) {
            emailItem = destinations.find(item => item.destination === 'email');
            smsItem = destinations.find(item => item.destination === 'sms');
            pushItem = destinations.find(item => item.destination === 'push');
            webhookItem = destinations.find(item => item.destination === 'webhook');
        }

        smsItem = {...smsItem, enabled: false};

        return (
          <div className="app-body-container-view">
            <div className="animated fadeIn animation-view">
              <div className="view-header mb-lg">
                <h1>EVENTS MANAGER</h1>
              </div>
              {hasError && (
                <div id="error-message-wrapper">
                  <Message
                    error
                    header="Oops!"
                    content={"Something went wrong. Try again later."}
                    className="error-message"
                  />
                </div>
              )}
              {showMessage && (
                <div
                  id="success-message-wrapper"
                  onClick={() => this.setState({ showMessage: false })}
                >
                  <Message
                    success
                    header="Done!"
                    content={"Changes were saved, click to hide."}
                    className="success-message"
                    style={{ height: "100%" }}
                  />
                </div>
              )}
              {!hasError && isLoading && (
                <LoaderComponent loadingMessage="Loading preferences..." />
              )}
              {/* VIEW BODY */}
              {!hasError && !isLoading && (
                <div id="notification-preferences-body" className="view-body">
                  <div id="notification-preferences-container">
                    <Accordion fluid styled>
                      <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.handleAccordionClick}
                      >
                        <Icon name="dropdown" />
                        Sources ({dataCollectors.length})
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 2}>
                        <Table
                          className="animated fadeIn"
                          unstackable
                          basic="very"
                        >
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell className="border-bottom-none pb0">
                                STATUS
                              </Table.HeaderCell>
                              <Table.HeaderCell className="border-bottom-none pb0">
                                NAME
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {dataCollectors.map((item, index) => {
                              return (
                                <Table.Row key={index}>
                                  <Table.Cell className="status-column">
                                    <Popup
                                      content={
                                        item.enabled ? "Disable" : "Enable"
                                      }
                                      trigger={
                                        <Checkbox
                                          toggle
                                          onChange={() =>
                                            this.toggle("dataCollectors", index)
                                          }
                                          checked={item.enabled}
                                        />
                                      }
                                    />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <p>{item.dataCollector.name}</p>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                      </Accordion.Content>
                      <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleAccordionClick}
                      >
                        <Icon name="dropdown" />
                        Triggers
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 1}>
                        <Grid celled="internally" stackable columns={2}>
                          <Grid.Row>
                            <Grid.Column>
                              <Table
                                className="animated fadeIn"
                                unstackable
                                basic="very"
                                style={{ margin: "20px" }}
                              >
                                <Table.Header>
                                  <Table.Row>
                                    <Table.HeaderCell className="border-bottom-none pb0">
                                      STATUS
                                    </Table.HeaderCell>
                                    <Table.HeaderCell className="border-bottom-none pb0">
                                      RISK
                                    </Table.HeaderCell>
                                  </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                  {risks.map((item, index) => {
                                    return (
                                      <Table.Row key={index}>
                                        <Table.Cell className="status-column">
                                          <Popup
                                            content={
                                              item.enabled
                                                ? "Disable"
                                                : "Enable"
                                            }
                                            trigger={
                                              <Checkbox
                                                toggle
                                                onChange={() =>
                                                  this.toggle("risks", index)
                                                }
                                                checked={item.enabled}
                                              />
                                            }
                                          />
                                        </Table.Cell>
                                        <Table.Cell>
                                          <Label
                                            horizontal
                                            style={{
                                              backgroundColor: this.colors[
                                                item.name.toUpperCase()
                                              ],
                                              color: "white",
                                              width: "100px",
                                              borderColor: this.colors[
                                                item.name.toUpperCase()
                                              ],
                                            }}
                                          >
                                            {item.name.toUpperCase()}
                                          </Label>
                                        </Table.Cell>
                                      </Table.Row>
                                    );
                                  })}
                                </Table.Body>
                              </Table>
                            </Grid.Column>
                            <Grid.Column>
                              <Table
                                className="animated fadeIn"
                                unstackable
                                basic="very"
                                style={{ margin: "20px" }}
                              >
                                <Table.Header>
                                  <Table.Row>
                                    <Table.HeaderCell className="border-bottom-none pb0">
                                      STATUS
                                    </Table.HeaderCell>
                                    <Table.HeaderCell className="border-bottom-none pb0">
                                      IMPORTANCE
                                    </Table.HeaderCell>
                                  </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                  {asset_importance.map((item, index) => {
                                    return (
                                      <Table.Row key={index}>
                                        <Table.Cell className="status-column">
                                          <Popup
                                            content={
                                              item.enabled
                                                ? "Disable"
                                                : "Enable"
                                            }
                                            trigger={
                                              <Checkbox
                                                toggle
                                                onChange={() =>
                                                  this.toggle(
                                                    "asset_importance",
                                                    index
                                                  )
                                                }
                                                checked={item.enabled}
                                              />
                                            }
                                          />
                                        </Table.Cell>
                                        <Table.Cell>
                                          <ImportanceLabel
                                            importance={item.name.toUpperCase()}
                                          />
                                        </Table.Cell>
                                      </Table.Row>
                                    );
                                  })}
                                </Table.Body>
                              </Table>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Accordion.Content>
                      <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleAccordionClick}
                      >
                        <Icon name="dropdown" />
                        Action
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 0}>
                        <Table
                          className="animated fadeIn"
                          unstackable
                          basic="very"
                        >
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell className="border-bottom-none pb0">
                                STATUS
                              </Table.HeaderCell>
                              <Table.HeaderCell className="border-bottom-none pb0"></Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell className="status-column">
                                <Popup
                                  content={
                                    pushItem.enabled ? "Disable" : "Enable"
                                  }
                                  trigger={
                                    <Checkbox
                                      toggle
                                      onChange={() =>
                                        this.toggleDestination(
                                          pushItem.destination
                                        )
                                      }
                                      checked={pushItem.enabled}
                                    />
                                  }
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <Header
                                  as="h4"
                                  className="notification-preferences-header"
                                >
                                  Push notifications
                                </Header>
                              </Table.Cell>
                            </Table.Row>

                            {/* <Table.Row>
                          <Table.Cell className="status-column">
                            <Popup content={smsItem.enabled ? 'Disable' : 'Enable'} trigger={
                              <Checkbox toggle onChange={() => this.toggleDestination(smsItem.destination)} checked={smsItem.enabled} />
                            }/>
                          </Table.Cell>
                          <Table.Cell>
                            <Header as='h4' className="notification-preferences-header">SMS</Header>
                          </Table.Cell>
                        </Table.Row>
                        {smsItem.enabled && <Table.Row>
                          <Table.Cell colSpan="2">
                            <Form className="form-label form-css-label" noValidate="novalidate">
                              <Form.Group inline>
                                <Form.Field required>
                                  <PhoneComponent onPhoneChange={this.onPhoneChange}></PhoneComponent>
                                </Form.Field>
                                <Button content="Add" disabled={isSaving || isLoading || !Validation.isValidPhone(newPhone)} onClick={this.onAdditionalPhoneAdded}/>
                              </Form.Group>
                              <div className="mt-lg ml-xs">
                                {smsItem.additional.map((item, index) => <div className="mt" key={index}><Icon name={item.active ? 'check' : 'clock' } color={item.active ? 'green' : 'yellow'} className="mr"></Icon><span>{item.phone}</span><Icon name="close" color="red" style={{marginLeft:10, cursor: 'pointer'}} onClick={() => this.removePhone(index)}></Icon></div>)}
                              </div>
                            </Form>
                          </Table.Cell>
                        </Table.Row>} */}

                            <Table.Row>
                              <Table.Cell className="status-column">
                                <Popup
                                  content={
                                    emailItem.enabled ? "Disable" : "Enable"
                                  }
                                  trigger={
                                    <Checkbox
                                      toggle
                                      onChange={() =>
                                        this.toggleDestination(
                                          emailItem.destination
                                        )
                                      }
                                      checked={emailItem.enabled}
                                    />
                                  }
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <Header
                                  as="h4"
                                  className="notification-preferences-header"
                                >
                                  Email
                                </Header>
                              </Table.Cell>
                            </Table.Row>
                            {emailItem.enabled && (
                              <Table.Row>
                                <Table.Cell colSpan="2">
                                  <Form
                                    className="form-label form-css-label"
                                    noValidate="novalidate"
                                  >
                                    <Form.Group inline>
                                      <Input
                                        style={{
                                          width: "100%",
                                          marginRight: "25px",
                                        }}
                                        placeholder="Add additional email"
                                        name="newEmail"
                                        value={newEmail}
                                        onChange={this.onAdditionalChange}
                                      />
                                      <Button
                                        content="Add"
                                        disabled={
                                          isSaving ||
                                          isLoading ||
                                          newEmail.length === 0
                                        }
                                        onClick={this.onAdditionalEmailAdded}
                                      />
                                    </Form.Group>
                                    <div className="mt-lg ml-xs">
                                      {emailItem.additional.map(
                                        (item, index) => (
                                          <div className="mt" key={index}>
                                            <Icon
                                              name={
                                                item.active ? "check" : "clock"
                                              }
                                              color={
                                                item.active ? "green" : "yellow"
                                              }
                                              className="mr"
                                            ></Icon>
                                            <span>{item.email}</span>
                                            <Icon
                                              name="close"
                                              color="red"
                                              style={{
                                                marginLeft: 10,
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                this.removeEmail(index)
                                              }
                                            ></Icon>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </Form>
                                </Table.Cell>
                              </Table.Row>
                            )}
                            <Table.Row>
                              <Table.Cell className="status-column">
                                <Popup
                                  content={
                                    webhookItem.enabled ? "Disable" : "Enable"
                                  }
                                  trigger={
                                    <Checkbox
                                      toggle
                                      onChange={() =>
                                        this.toggleDestination(
                                          webhookItem.destination
                                        )
                                      }
                                      checked={webhookItem.enabled}
                                    />
                                  }
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <Header
                                  as="h4"
                                  className="notification-preferences-header"
                                >
                                  Webhooks
                                </Header>
                              </Table.Cell>
                            </Table.Row>
                            {webhookItem.enabled && (
                              <Table.Row>
                                <Table.Cell colSpan="2">
                                  <Form
                                    className="form-label form-css-label"
                                    noValidate="novalidate"
                                  >
                                    <Form.Group>
                                      <Input
                                        style={{
                                          width: "100%",
                                          marginRight: "25px",
                                        }}
                                        placeholder="Enter webhook url"
                                        name="newWebhookUrl"
                                        value={newWebhookUrl}
                                        onChange={this.onAdditionalChange}
                                      />
                                      <Input
                                        style={{
                                          width: "100%",
                                          marginRight: "20px",
                                        }}
                                        placeholder="Enter SHA-256 secret"
                                        name="newSecret"
                                        value={newSecret}
                                        onChange={this.onAdditionalChange}
                                      />
                                      <div className="td-actions" style={{marginRight: "20px"}}>
                                        <button
                                          onClick = {() => {this.setState({showWebhookInfo:true})}}
                                        >
                                          <i className="fas fa-info-circle" />
                                        </button>
                                      </div>
                                      <Button
                                        content="Add"
                                        disabled={
                                          isSaving ||
                                          isLoading ||
                                          newWebhookUrl.length === 0
                                        }
                                        onClick={this.onAdditionalWebhookAdded}
                                      />
                                    </Form.Group>
                                    <div className="mt-lg ml-xs">
                                      {webhookItem.additional.map(
                                        (item, index) => (
                                          <div className="mt" key={index}>
                                            <Icon
                                              name={
                                                item.active ? "check" : "clock"
                                              }
                                              color={
                                                item.active ? "green" : "yellow"
                                              }
                                              className="mr"
                                            ></Icon>
                                            <span>{item.url}</span>
                                            <Icon
                                              name="close"
                                              color="red"
                                              style={{
                                                marginLeft: 10,
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                this.removeWebhook(index)
                                              }
                                            ></Icon>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </Form>
                                </Table.Cell>
                              </Table.Row>
                            )}
                          </Table.Body>
                        </Table>
                      </Accordion.Content>
                    </Accordion>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {/* <Form.Button type="button" loading={isLoading || isSaving} disabled={isLoading || isSaving} content="Cancel" style={{marginTop: 25}} onClick={() => this.props.history.push('/dashboard/notifications')}/> */}
                      <Form.Button type="button" loading={isLoading || isSaving} disabled={isLoading || isSaving} content="See notifications" style={{marginTop: 25}} onClick={() => this.props.history.push('/dashboard/events_log')}/>
                      <Form.Button
                        color="green"
                        disabled={isLoading || isSaving}
                        loading={isSaving}
                        content="Save"
                        style={{ marginTop: 25, marginLeft: 10 }}
                        onClick={this.save}
                      />
                    </div>
                  </div>
                  {showWebhookInfo && (
                    <WebhookInfoModal
                    onClose={this.closeWebhookInfo}
                  />
                  )}
                </div>
              )}
            </div>
          </div>
        );
    }
}

export default NotificationsPreferencesComponent;