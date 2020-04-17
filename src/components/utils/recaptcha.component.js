import React, { Component } from "react";
import { ReCaptcha } from "react-recaptcha-google";
import { observer, inject } from "mobx-react";

@inject("authStore")
@observer
class RecaptchaComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  componentDidMount() {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  }

  onLoadRecaptcha() {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  }

  verifyCallback(recaptchaToken) {
    if (recaptchaToken) {
      this.props.authStore.setCaptcha(recaptchaToken);
    } else {
      this.props.authStore.setCaptcha(null);
    }
  }

  render() {
    return (
      <div>
        {/* You can replace captchaDemo with any ref word */}
        <ReCaptcha
          ref={el => {
            this.captchaDemo = el;
          }}
          size="normal"
          data-theme="dark"
          render="explicit"
          sitekey={window.RECAPTCHA_SITEKEY}
          onloadCallback={this.onLoadRecaptcha}
          verifyCallback={this.verifyCallback}
        />
      </div>
    );
  }
}
export default RecaptchaComponent;
