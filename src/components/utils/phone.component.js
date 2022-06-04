import * as React from "react";
import { Dropdown, Grid, Input, Form } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import "./phone.component.css";

class PhoneComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      phone: this.props.currentPhone
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.currentPhone !== this.props.currentPhone) {
      this.setState({
        phone: this.props.currentPhone
      })
    }
  }

  onPhoneChange(e){
    this.setState({ phone: e })
    this.props.onPhoneChange(e);
  }

  render() {
    return (
      <div className="form-label form-css-label">
        <Grid style={{ display: "initial" }}>
          <PhoneInput
            placeholder="Enter phone number"
            value={this.state.phone}
            onChange={(e) => this.onPhoneChange(e)}
          />
        </Grid>
      </div>
    );
  }
}

export default PhoneComponent;
