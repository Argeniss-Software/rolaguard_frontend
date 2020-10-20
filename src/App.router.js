import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Login from './pages/login.page'
import Register from './pages/register.page'
import Dashboard from './pages/dashboard.page'
import Recovery from './pages/password-recovery.page'
import PasswordCreation from './pages/password-create.page'
import NotFoundPage from './pages/notFoundPage.page';
import EmailChange from './pages/email-change.page';
import EmailActivation from './pages/email-activation.page';
import PhoneActivation from './pages/phone-activation.page';

const Router = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/recovery" component={Recovery} />
    <Route path="/activation/:token" component={PasswordCreation} />
    <Route path="/change_password/:token" component={PasswordCreation} />
    <Route path="/change_email_request/:token" component={EmailChange} />
    <Route
      path="/notifications/email_activation/:token"
      component={EmailActivation}
    />
    <Route
      path="/notifications/phone_activation/:token"
      component={PhoneActivation}
    />
    <Route
      render={() => 
        <NotFoundPage status="404" statusText="Not found" />
      }
    />
  </Switch>
);

export default Router
