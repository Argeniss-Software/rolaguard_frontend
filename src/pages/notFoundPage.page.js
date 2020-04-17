import * as React from 'react';
import { observer, inject } from "mobx-react";
import "./notFoundPage.page.css";
import {Icon} from "semantic-ui-react";

@inject()
@observer
class NotFoundPage extends React.Component {

    constructor(props){
        super(props)
    }

    render() {
        return (
            <div className="not-found-page">
                <div className="animated fadeIn not-found-text">
                    <Icon name="exclamation"/>
                    <h1>404</h1>
                </div>
                <h5 className="animated fadeIn">Page not found</h5>

                <button className="animated fadeIn" onClick={this.returnDashboard}>GO BACK</button>
            </div>
        )
    }

    returnDashboard = () => {
        this.props.history.push("/dashboard");
    }

}

export default NotFoundPage