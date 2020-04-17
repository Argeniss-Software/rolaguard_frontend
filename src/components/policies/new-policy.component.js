import * as React from "react";
import { inject } from "mobx-react";
import { Divider, Form, Label, Checkbox, Icon, Card, Accordion, Message, Popup, Table } from "semantic-ui-react";
import LoaderComponent from "../utils/loader.component";
import "./new-policy.component.css";
import { Markup } from 'interweave';  
import AlertUtil from "../../util/alert-util";

@inject("policyStore", "alarmStore")
class NewPolicyComponent extends React.Component {

  state = {
    policyId: null,
    isLoading: false,
    hasError: false,
    hasFatalError: false,
    errors: {},
    isSaving: false,
    selectedTemplate: null,
    policies: [],
    policy: {
      name: '',
      items: []
    },
    touched: {
      name: false
    }
  }

  componentWillMount() {
    const policyId = this.props.match.params.id;
    const cloneId = new URLSearchParams(this.props.location.search).get('clone');
    this.setState({ isLoading: true, policyId });
    if(policyId) {
      this.props.policyStore.get(policyId).then(
        res => {
          const policy = res.data;
          const {errors, hasError} = this.checkValidations(policy);
          this.setState({ policy, isLoading: false, errors, hasError });
        }).catch(
          err => {
            this.setState({ isLoading: false, hasFatalError: true });
            console.error(err);
          }
        );      
    }  else {
      this.props.policyStore.query({page: 1, size: 100000}).then(
        res => {
          const policies = res.data.map( policy => {
            return {
              key: policy.id,
              value: policy.id,
              text: policy.name,
              item: policy
            };
          });
          
          const template = policies.find(p => p.text === 'Default');
          const policy = Object.assign({}, template.item);
          delete policy.id;
          policy.name = '';
          policy.items = [];
          for(const key in template.item.items) {
            const policyItem = Object.assign({}, template.item.items[key]);
            policy.items.push(policyItem);
          }

          const {errors, hasError} = this.checkValidations(policy);
          this.setState({ policies, isLoading: false, errors, hasError, policy, selectedTemplate: cloneId ? parseInt(cloneId) : template.value });
        }
        ).catch(
          err => {
            this.setState({ isLoading: false, hasFatalError: true });
            console.error(err);
          }
        );
    }
  }

  handleChange = (e, { name, value }) => {
    const { policy, touched } = this.state;
    const keys = name.split('-');
    if(keys.length > 1) {
      if(value === '') {
        policy.items[keys[0]].parameters[keys[1]] = null;
      } else {
        policy.items[keys[0]].parameters[keys[1]] = value;
      }
    } else {
      touched[name] = true;
      policy[name] = value;
    }
    const { errors, hasError } = this.checkValidations(policy);
    this.setState({ policy, touched, errors, hasError });
  }

  handleSubmit = () => {
    const { policy, policyId } = this.state;
    if(policyId) {
      this.props.policyStore.put(policyId, policy).then(
        () => {
          this.setState({ isSaving: false});
          this.props.history.push('/dashboard/policies')
        }
      ).catch(this.handleApiErrors);
    } else {
      this.props.policyStore.post(policy).then(
        () => {
          this.setState({ isSaving: false});
          this.props.history.push('/dashboard/policies')
        }
      ).catch(this.handleApiErrors);
    }
    this.setState({ isSaving: true });
  }

  handleApiErrors = error => {
    console.error(error);
    const { errors } = this.state;
    if(!error.response || error.response.status !== 400) {
      this.setState({ isSaving: false, hasFatalError: true });
    } else {
      const nameError = error.response.data.find(err => err.code === 'EXISTING_NAME');
      if(nameError) {
        errors['name'] = nameError.message;
      } else {
        errors['generic'] = '-';
      }
      this.setState({ isSaving: false, errors, hasError: true });
    }
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex })
  }

  toggle = index => {
    const { policy } = this.state;
    policy.items[index].enabled = !policy.items[index].enabled;
    this.setState({ policy });
  }

  chooseTemplate = (e, { value }) =>{
    const template = this.state.policies.find(policy => policy.key === value);
    if(template) {
      const policy = Object.assign({}, template.item);
      delete policy.id;
      policy.name = '';
      policy.items = [];
      for(const key in template.item.items) {
        const policyItem = Object.assign({}, template.item.items[key]);
        policy.items.push(policyItem);
      }
      this.setState({policy, selectedTemplate: value});
    }
  }

  checkValidations = (policy) => {
    const errors = {};
    let hasError = false;
    if(policy.name.length === 0) errors['name'] = 'This field is required';
    else if(policy.name.length < 3) errors['name'] = 'Name length must be greater than 3';
    else if(policy.name.length > 100) errors['name'] = 'Name length can\'t be greater than 100';
    if(errors.name) hasError = true;
    errors.items = {};

    policy.items.forEach((item, index) => {
      errors.items[index] = { parameters: {} };
      Object.keys(item.parameters).forEach(key => {
        const params = item.parameters;
        const field = params[key];
        const parameterDefinition = item.alertType.parameters[key];
  
        const { type, maximum, minimum } = parameterDefinition;
        let validType = null, validMaximum = null, validMinimum = null;
        if(field) {
          switch(type) {
            case 'Float':
              validType = !isNaN(field);
              if(validType) {
                params[key] = parseFloat(field);
              }
              break;
            case 'Integer':
              validType = !isNaN(field) && parseInt(field) === parseFloat(field);
              if(validType) {
                params[key] = parseInt(field);
              }
              break;
          }
          if(validType && maximum !== undefined) {
            validMaximum = parseFloat(field) <= maximum;
          }
  
          if(validType && minimum !== undefined) {
            validMinimum = parseFloat(field) >= minimum;
          }
        }
        errors['items'][index]['parameters'][key] = { validType, validMaximum, validMinimum }; 
        if(validType === false || validMaximum === false || validMinimum === false) hasError = true;
      });  
    });
    return { errors, hasError };
  }

  getParametersComponent = (item, index, activeIndex, errors) => {
    const params = item.parameters;
    if(Object.keys(params).length > 0) return (
      <Accordion>
      <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleAccordionClick}>
        <Icon name='dropdown' />
        <strong>Advanced settings</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === index}>
        <Message warning style={{display: 'block', maxWidth: '100%'}}>
          <Message.Header>Security Warning!</Message.Header>
          <p>Changes on these parameters will affect the security analysis.</p>
        </Message>
        {Object.keys(params).map(key => {
          const field = params[key];
          const parameterDefinition = item.alertType.parameters[key];
          const { validType, validMaximum, validMinimum } = errors[key];
          return (
            <Card className="policy-component-card" key={key}>
              <Card.Header></Card.Header>
              <Card.Content>
                <div>
                  <h3>{key}</h3>
                  <div style={{marginLeft: 3, marginBottom:3, marginTop: 0}}><p>{parameterDefinition.description}</p></div>
                  <div style={{marginLeft: 3}}><i>Default value: {parameterDefinition.default}</i></div>
                </div>
                <Divider/>
                <Form.Group style={{marginTop: 20}}>
                  <Form.Field className="full-field-2">
                    <h5>Custom value</h5>
                    <Form.Input placeholder={parameterDefinition.default} value={field === null ? '' : field} name={`${index}-${key}`} onChange={this.handleChange} type={['Integer', 'Float'].includes(parameterDefinition.type) ? 'number' : 'text'}/>
                  </Form.Field>
                  <Form.Field className="full-field-2" style={{marginTop: 0, marginLeft: 50}}>
                    <h5>Validations</h5>
                    {parameterDefinition.type !== undefined && <div><Icon name={validType === null ? 'circle outline' : (validType ? 'check' : 'close')} color={validType === null ? 'grey' : (validType ? 'green' : 'red')}/><span>Type: {parameterDefinition.type}</span></div> }
                    {parameterDefinition.maximum !== undefined && <div><Icon name={validMaximum === null ? 'circle outline' : (validMaximum ? 'check' : 'close')} color={validMaximum === null ? 'grey' : (validMaximum ? 'green' : 'red')}/><span>Max value: {parameterDefinition.maximum}</span></div>}
                    {parameterDefinition.minimum !== undefined && <div><Icon name={validMinimum === null ? 'circle outline' : (validMinimum ? 'check' : 'close')} color={validMinimum === null ? 'grey' : (validMinimum ? 'green' : 'red')}/><span>Min value: {parameterDefinition.minimum}</span></div>}
                  </Form.Field>
                </Form.Group>
              </Card.Content>
            </Card>
          )
        })}

        </Accordion.Content>
      </Accordion>
      )
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

    const { policyId, policy, isLoading, isSaving, activeIndex, selectedTemplate, policies, touched, hasFatalError, errors, hasError } = this.state;
    const { history } = this.props;

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view">
          <div className="view-header">
            <h1>{policyId ? 'EDIT POLICY' : 'NEW POLICY'}</h1>
          </div>
          <div className="view-body pt-lg">
            {isLoading && 
              <LoaderComponent loadingMessage="Loading..." />
            }
            {!isLoading && !hasFatalError &&
              <Form className="form-label form-css-label" onSubmit={this.handleSubmit}>
                <Form.Group className="mb-xl">
                  <Form.Field className="full-field-2" required>
                    <Form.Input
                      required
                      name="name"
                      value={policy.name}
                      onChange={this.handleChange}
                    >
                      <input/>
                      <label>Name</label>
                    </Form.Input>
                    {touched.name && errors.name && (
                      <Label basic color="red" pointing>
                        {errors.name}
                      </Label>
                    )}
                  </Form.Field>
                  {!policyId && 
                    <Form.Field className="full-field-2">
                      <div className="dropdown-label-wrapper">
                        <label className="dropdown-label">Clone from existing policy 
                          <Popup content='Use the configuration of an existing policy to create the new policy' trigger={
                            <Icon name='question circle outline' size='large'/>
                          }/>
                        </label>
                        <Form.Dropdown search selection options={policies} placeholder="Select policy" name="clone_policy" value={selectedTemplate} onChange={this.chooseTemplate}/>
                      </div>
                    </Form.Field>
                  }
                </Form.Group>
                <div>

                { policy.items.map( (item, index) => 
                  <div key={index}>
                    <Table className="animated fadeIn" basic="very">
                      {this.getPolicyHeader(index)}
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell collapsing className="border-bottom-none" width="1"><Checkbox toggle className="policy-checkbox" onChange={() => this.toggle(index)} checked={item.enabled}/></Table.Cell>
                          <Table.Cell singleLine className="border-bottom-none"><b>{item.alertType.name}</b></Table.Cell>
                          <Table.Cell collapsing className="border-bottom-none" width="1">
                            <Label horizontal style={{backgroundColor: AlertUtil.getColorsMap()[item.alertType.risk], color: 'white', borderWidth: 1, width: '80px'}}>
                              {item.alertType.risk}
                            </Label>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell/>
                          <Table.Cell colSpan='2'>
                            <Markup content={item.alertType.description}/>
                            { this.getParametersComponent(item, index, activeIndex, errors['items'][index]['parameters']) }
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    <Divider className="divider-margin"></Divider>
                  </div>
                ) }
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <Form.Button type="button" disabled={isLoading || isSaving} content="Cancel" style={{marginTop: 25}} onClick={() => history.push('/dashboard/policies')}/>
                  <Form.Button color="green" loading={isLoading || isSaving} disabled={isLoading || isSaving || hasError} content="Save" style={{marginTop: 25, marginLeft: 10}}/>
                </div>
              </Form>
            }
            {(hasFatalError || errors['generic']) && 
              <Message error header='Oops!' content={'Something went wrong. Try again later.'} style={{maxWidth: '100%'}}/>
            }

          </div>
        </div>
      </div>
    );
  }

}

export default NewPolicyComponent;
