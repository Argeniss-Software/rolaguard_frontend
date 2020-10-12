import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
    if (!window.RECAPTCHA_SITEKEY){
      this.props.authStore.setCaptcha("Recaptcha site-key not set");
      return (<div></div>);
    }
    return (
      <div>
        {/* You can replace captchaDemo with any ref word */}
        <ReCAPTCHA
          ref={(el) => {
            this.captchaDemo = el;
          }}
          size="normal"
          theme="light"
          render="explicit"
          sitekey={window.RECAPTCHA_SITEKEY}
          // onloadCallback={this.onLoadRecaptcha}
          onChange={this.verifyCallback}
        />
      </div>
    );
  }
}
export default RecaptchaComponent;
