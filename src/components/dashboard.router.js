import * as React from 'react';
import { Switch , Route } from 'react-router-dom'

//custom components
import QuarantineComponent from '../components/quarantine.component';
import UsersComponent from '../components/user.list.component';
import UsersNewComponent from '../components/user.new.component';
import UsersEditComponent from '../components/user.edit.component';
import DashboardComponent from './dashboard.component';
import NotFoundPage from '../pages/notFoundPage.page';
import UserProfileComponent from './user.profile.component';
import AlarmReviewComponent from './alarm_review.component';
import InventoryReviewComponent from './inventory/inventory.component';
import ResourceUsageComponent from './resource-usage/resource.component';
// Don't delete the next line. It serves the DatePicker in the Alerts Review dashboard
import ReportComponent from './reports-page';
import DataCollectorListComponent from './data_collectors.list.component';
import DataCollectorLogComponent from './data_collector.log.component';
import DataCollectorViewComponent from './data_collector.view.component';
import DataCollectorNewComponent from './data_collectors.new.component';
import NewPolicyComponent from './policies/new-policy.component';
import ListPoliciesComponent from './policies/list-policies.component';
import ViewPolicyComponent from './policies/view-policy.component';
import NotificationsPreferencesComponent from './notifications-preferences.component';
import ListNotificationsComponent from './notifications/list-notifications.component';

class DashBoardRouter extends React.Component {
    render() {
        return (
                <Switch>
                    {/* DASHBOARD */}
                    <Route exact path='/dashboard' component={DashboardComponent}/>

                    {/* QUARANTINE */}
                    <Route exact path='/dashboard/current_issues' component={QuarantineComponent}/>

                    {/* DEVICES */}
                    <Route exact path='/dashboard/inventory' component={InventoryReviewComponent}/>

                    {/* RESOURCES */}
                    <Route exact path='/dashboard/resources_usage' component={ResourceUsageComponent}/>

                    {/* DATA COLLECTORS */}
                    <Route exact path='/dashboard/data_collectors' render={ (props) => <DataCollectorListComponent history={props.history}  /> }/>
                    <Route path='/dashboard/data_collectors/:data_collector_id/view' component={DataCollectorViewComponent}/>
                    <Route path='/dashboard/data_collectors/new' component={DataCollectorNewComponent}/>
                    <Route path='/dashboard/data_collectors/:data_collector_id/edit' component={DataCollectorNewComponent}/>
                    <Route path='/dashboard/data_collectors/:data_collector_id/log' component={DataCollectorLogComponent}/>

                    {/* POLICIES */}
                    <Route path='/dashboard/policies/new' component={NewPolicyComponent}/>
                    <Route exact path='/dashboard/policies' render={ (props) => <ListPoliciesComponent history={props.history}/> } />
                    <Route path='/dashboard/policies/:id/view' component={ViewPolicyComponent}/>
                    <Route exact path='/dashboard/policies/:id/edit' component={NewPolicyComponent}/>

                    {/* NOTIFICATIONS */}
                    <Route exact path='/dashboard/events_log' component={ListNotificationsComponent}/>
                    <Route exact path='/dashboard/events_manager' component={NotificationsPreferencesComponent}/>

                    {/* ALARM EVENTS */}
                    <Route path='/dashboard/alerts_review' component={AlarmReviewComponent} />
                    
                    {/* USERS */}
                    <Route exact path='/dashboard/users' render={ (props) => <UsersComponent history={props.history}  /> }/>
                    <Route path='/dashboard/users/new' render={ (props) => <UsersNewComponent history={props.history} match={props.match}/> }/>
                    <Route path='/dashboard/users/:username' render={ (props) => <UsersEditComponent history={props.history} match={props.match}/> } />

                     {/* PROFILE */}
                    <Route path='/dashboard/profile/:username' render={ (props) => <UserProfileComponent history={props.history} match={props.match}/> } />
                    <Route component={NotFoundPage} />

                </Switch>
        )
    }
}

export default DashBoardRouter