import * as React from "react";
import { Button, Grid } from "semantic-ui-react";
import { withRouter } from 'react-router-dom';

class BackToLoginComponent extends React.Component {
    render() {
        return (
            <Button size="large" onClick={() => this.props.history.push("/login")} content="Back to Login"/>
        );
    }
}

export default withRouter(BackToLoginComponent);
