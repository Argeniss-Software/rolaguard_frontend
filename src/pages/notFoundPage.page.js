import * as React from "react";
import "./notFoundPage.page.css";
import { Icon, Button } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

const NotFoundPage = (props) => {

  const {status, statusText, history} = props
  
  return (
    <div className="not-found-page">
      <div className="animated fadeIn not-found-text">
        <Icon name="exclamation" />
        <h1>{status}</h1>
      </div>
      <h5 className="animated fadeIn">{statusText}</h5>

      <Button positive onClick={() => {history.push('/dashboard')}}>
        GO BACK
      </Button>
    </div>
  );
};

export default withRouter(NotFoundPage);