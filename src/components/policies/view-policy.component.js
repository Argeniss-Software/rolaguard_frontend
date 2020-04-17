import * as React from "react";
import { inject } from "mobx-react";
import { Divider, Form, Table, Icon, Card, Accordion, Label, Message } from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";

import { Markup } from 'interweave';  
import AlertUtil from "../../util/alert-util";
import Validation from "../../util/validation";
import "./view-policy.component.css"
  
@inject("policyStore", "usersStore")
class ViewPolicyComponent extends React.Component {

    state = {
        isLoading: false,
        title: 'VIEW POLICY',
        policy: null,
        policyId: null,
        hasError: false,
        activeIndex : null
    }        

  componentWillMount() {
    const policyId = this.props.match.params.id;
    this.setState({ policyId, isLoading: true });

    this.props.policyStore.get(policyId).then(
        res => {
            const policy = res.data;
            this.setState({ policy, isLoading: false });
        }
    ).catch(
        err => {
          this.setState({ isLoading: false, hasError: true });
          console.error(err);
        }
      );  
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex })
  }

  getParametersComponent = (item, index, activeIndex) => {
    const params = item.parameters;
    if(Object.keys(params).length > 0) return (
      <Accordion>
      <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleAccordionClick}>
        <Icon name='dropdown' />
        <strong>Advanced settings</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === index}>
      {Object.keys(params).map(key => {
        const field = params[key];
        return (
          <Card style={{width: 'auto', background: 'transparent !important'}} key={key}>
            <Card.Header></Card.Header>
            <Card.Content>
              <div>
                <h3>{key}</h3>
                <div style={{marginLeft: 3, marginBottom:3, marginTop: 0}}><p>{item.alertType.parameters[key].description}</p></div>
                <div style={{marginLeft: 3}}><i>Default value: {item.alertType.parameters[key].default}</i></div>
              </div>
              <Divider/>
              <Form.Group style={{marginTop: 20}}>
                <Form.Field className="full-field-2">
                  <h5>Custom value</h5>
                  <p>{field ? field : 'None (default value will be used).'}</p>
                </Form.Field>
                <Form.Field className="full-field-2" style={{marginTop: 0, marginLeft: 50}}>
                </Form.Field>
              </Form.Group>
            </Card.Content>
          </Card>
        )
      })}
      </Accordion.Content>
      </Accordion>
    );
  }

  getPolicyHeader = (index) => {
    if (index > 0) return;
    return (
      <Table.Header className={index > 0 ? "hide" : "header-row"}>  
        <Table.Row>
          <Table.HeaderCell width="1" className="header-center">Status</Table.HeaderCell>
          <Table.HeaderCell className="left aligned">Description</Table.HeaderCell>
          <Table.HeaderCell width="1" className="header-center">Risk</Table.HeaderCell>
        </Table.Row>

      </Table.Header>
    );
  }

  render() {

    const { title, policy, isLoading, activeIndex, hasError } = this.state;

    const { history } = this.props;

    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            <h1>{title}</h1>
            {isAdmin && policy && !policy.isDefault && <div className="view-header-actions">
              <div onClick={() => history.push(`/dashboard/policies/${policy.id}/edit`)}>
                <i className="fas fa-plus" />
                <span>EDIT POLICY</span>
              </div>
            </div>
            }
          </div>
          <div className="view-body">
            {isLoading && 
                <LoaderComponent loadingMessage="Loading policy..." />
            }
            { hasError && 
              <Message error header='Oops!' content={'Something went wrong. Try again later.'} style={{maxWidth: '100%'}}/>
            }
            {!isLoading && policy &&
              <Form style={{marginLeft: 50, marginRight: 50, marginBottom: 50}}>
                <Form.Group style={{marginBottom: 50}}>
                  <Form.Field className="full-field-2">
                    <label>Name</label>
                    <h2 style={{marginTop: 5}}><i>{policy.name}</i></h2>
                  </Form.Field>
                  <Form.Field className="full-field-2"></Form.Field>
                </Form.Group>

                { policy.items.map( (item, index) =>  
                <div key={index}>
                    <Table className="animated fadeIn" basic="very">
                      {this.getPolicyHeader(index)}
                        <Table.Body >
                          <Table.Row >
                            <Table.Cell collapsing className="border-bottom-none header-left" width="1">
                              { item.enabled ?
                                <Label as='a' basic color='green' style={{float: 'right', cursor: 'default'}}>ENABLED</Label> :
                                <Label as='a' basic color='grey' style={{float: 'right', cursor: 'default'}}>DISABLED</Label>
                              }
                            </Table.Cell>
                            <Table.Cell singleLine className="border-bottom-none"><b>{item.alertType.name}</b></Table.Cell>
                            <Table.Cell collapsing className="border-bottom-none" width="1">
                              <Label horizontal style={{backgroundColor: AlertUtil.getColorsMap()[item.alertType.risk], color: 'white', borderWidth: 1, width: '80px'}}>
                                {item.alertType.risk}
                              </Label>
                            </Table.Cell>
                          </Table.Row>

                          <Table.Row >
                            <Table.Cell />
                            <Table.Cell colSpan='2' >
                              <Markup content={item.alertType.description}/>
                              { this.getParametersComponent(item, index, activeIndex) }
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    <Divider className="divider-margin"></Divider>
                </div>
                ) }
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <Form.Button type="button" loading={isLoading} disabled={isLoading} content="Back" style={{marginTop: 25}} onClick={() => history.push('/dashboard/policies')}/>
                </div>
              </Form>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ViewPolicyComponent;
