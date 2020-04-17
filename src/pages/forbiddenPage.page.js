import * as React from 'react';
import { observer, inject } from "mobx-react";
import "./forbiddenPage.page.css";
import {Icon} from "semantic-ui-react";

@inject()
@observer
class ForbiddenPage extends React.Component {

    constructor(props){
        super(props)
    }

    render() {
        return (
            <div className="not-found-page">
                <div className="animated fadeIn not-found-text">
                    <Icon name="exclamation"/>
                    <h1>403</h1>
                </div>
                <h5 className="animated fadeIn">Access Forbidden</h5>

                <button className="animated fadeIn" onClick={this.returnDashboard}>GO BACK</button>
            </div>
        )
    }

    returnDashboard = () => {
        this.props.history.push("/dashboard");
    }

}

export default ForbiddenPage