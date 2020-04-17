import * as React from "react";
import { Route } from 'react-router-dom'
import { observer, inject } from "mobx-react";
import {
  Form,
  Label,
  Button,
  Accordion,
  Icon
} from "semantic-ui-react/dist/commonjs";
import Validation from "../util/validation";
import PasswordAccordion from "./utils/password.accordion.component";
import EmailAccordion from "./utils/email.accordion.component";
import LoaderComponent from "./utils/loader.component";
import PhoneComponent from "./utils/phone.component";
import ForbiddenPage from '../pages/forbiddenPage.page';

@inject("usersStore", "messageStore", "authStore", "rolesStore")
@observer
class UsersNewComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      activeIndex: 0,
      user: {
        username: "",
        email: "",
        full_name: "",
        password: "",
        password2: "",
        phone: "",
        user_roles: ""
      },
      valueDropdown: [],
      typeForm: "Edit",
      formHasError: true,
      showErrors: {
        full_name: false,
        username: false,
        usernameExists: false,
        emailExists: false,
        email: false,
        usernameHasWhiteSpaces: false
      },
      loadingUserData: true,
      title: "EDIT USER",
      roleList: [],
      defaultRole: "",
      success: false
    };

    this.getData();
  }
  
  getData = () => {
    const userDataPromise = this.props.usersStore.getUserByUsernameApi(this.props.match.params.username);
    const userRolesPromise = this.props.rolesStore.getRolesApi();

    Promise.all([userDataPromise, userRolesPromise]).then(
      (response) => {
        const userData = response[0].data
        const userRoles = response[1];

        // User
        const user = this.state.user;
        const roleList = [];

        for (let key in userData) {
          user[key] = userData[key];
        }

        // Roles
        userRoles.forEach(role => {
          if(role.id === user.user_roles[0]) {
            user.user_roles = role.id;
          }

          roleList.push({
            key: role.id,
            text: role.role_name.replace("_", " "),
            value: role.id
          });
        });
  
        this.setState({
          loadingUserData: false,
          user: user,
          defaultRole: user.user_roles[0],
          roleList: roleList
        });
      }
    )
  };

  validateForm = () => {
    let showErrors = this.state.showErrors;
    let formHasError = this.state.formHasError;

    showErrors.fullNameTooLong = Validation.exceedsFullNameLength(this.state.user.full_name);

    formHasError = showErrors.emailTooLong || showErrors.fullNameTooLong ? true : false;;

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
    }

    this.setState({
      user: user,
      showErrors: showErrors
    });
  };

  handleSubmit = () => {
    let errors = this.validateForm();

    if (!errors) {
      this.setState({ loading: true });

      this.props.usersStore.updateUser(this.state.user).then(response => {
        this.setState({
          loading: false,
          success: true
        });
        
      });
    }
  };

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  onPhoneChange = (phone) => {
    const user = this.state.user;
    user.phone = phone;

    this.setState({user: user});
  }

  roleDropdownDisabled() {
    return this.state.user.username === this.props.usersStore.currentUser.username || !Validation.isUserAdmin(this.props.usersStore.currentUser);
  }

  render() {
    const { user, title, activeIndex } = this.state;
    const hideSave = Validation.isEmpty(user.full_name) || user.user_roles.length === 0;
    const isAdmin = Validation.isUserAdmin(this.props.usersStore.currentUser);

    const roleDropdownDisabled = this.roleDropdownDisabled();

    return (      
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view dashboard">
          <div className="view-header">
            {/* HEADER TITLE */}
            <h1>{title}</h1>
          </div>

          {/* VIEW BODY CHECK IF USER IS ADMIN*/}
          { (isAdmin)  &&
          <div className="view-body">
            <div style={{"paddingTop": "10px", "paddingRight": "5px"}}>
              <Accordion fluid styled>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  User
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                  <Form className="form-label form-css-label text-center" onSubmit={this.handleSubmit} noValidate="novalidate">
                    <Form.Field required>
                      <Form.Input
                        required
                        name="full_name"
                        value={user.full_name}
                        onChange={this.handleChange}
                        error={this.state.showErrors.fullNameTooLong}
                      >
                        <input />
                        <label>Full Name</label>
                      </Form.Input>
                      {this.state.showErrors.fullNameTooLong && (
                        <Label className="mt0" basic color="red" pointing>
                          Full name is too long. Please enter a maximum of 64 letters.
                        </Label>
                      )}
                    </Form.Field>
                    <Form.Field required>
                      <div className="dropdown-label-wrapper">
                        <label className="dropdown-label">User role</label>
                        <Form.Dropdown
                          placeholder="Select user role"
                          name="user_roles"
                          selection
                          options={this.state.roleList}
                          value={user.user_roles}
                          onChange={this.handleChange}
                          disabled={roleDropdownDisabled}
                        />
                      </div>
                    </Form.Field>
                    <Form.Field>
                      <PhoneComponent currentPhone={this.state.user.phone} onPhoneChange={this.onPhoneChange}></PhoneComponent>
                    </Form.Field>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end"
                      }}>
                      <Button
                        type="reset"
                        disabled={this.state.loading}
                        content="Back"
                        onClick={() => {this.props.history.goBack()}}
                      />
                      <Button
                        type="submit"
                        color="green"
                        disabled={this.state.loading || hideSave}
                        loading={this.state.loading}
                        content="Save"
                      />
                    </div>
                    {this.state.loadingUserData && (
                      <LoaderComponent loadingMessage="Loading ..."/>
                    )}
                    {this.state.success && (
                      <Label className="text-center mh-auto" basic color='green'>The user has been successfully updated.</Label>
                    )}
                    {this.state.error && (
                      <Label className="text-center mh-auto" basic color='red'>We are sorry. It has been an error while trying to update the user.</Label>
                    )}
                  </Form>
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  Change email
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                  <EmailAccordion user={{ user }} />
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  Change password
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                  <PasswordAccordion />
                </Accordion.Content>
              </Accordion>
            </div>
          </div>
          }
          {/* SHOW FORBIDDEN ERROR */}
          { 
           !isAdmin && <Route component={ForbiddenPage} />
          }
        </div>
      </div>
    );
  }
}

export default UsersNewComponent;
