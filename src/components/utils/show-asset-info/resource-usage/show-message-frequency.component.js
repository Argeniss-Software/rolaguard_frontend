import React from "react";
import { Icon, Popup, Divider, Message } from "semantic-ui-react";
import NumberFormat from "react-number-format";
import moment from "moment";

const ShowMessageFrequency = (props) => {
  return (
    <React.Fragment>
      {props.asset.activity_freq !== null && (
        <Popup
          trigger={
            <span>
              {props.asset.is_regular !== true && (
                <Icon color="yellow" name="warning circle" type="icon" />
              )}
              {moment
                .duration(props.asset.activity_freq || 0, "seconds")
                .humanize()}
            </span>
          }
          position="bottom left"
          flowing
        >
          <Popup.Header>Frequency of messages</Popup.Header>
          <Popup.Content>
            <NumberFormat
              value={(props.asset.activity_freq || 0).toFixed(1)}
              displayType={"text"}
              suffix={" s."}
              decimalScale="1"
            />
            {props.asset.is_regular !== true && (
              <Message icon size="tiny" wide>
                <Icon color="yellow" name="warning circle" type="icon" />
                <Message.Content>
                  <Message.Header>Irregular asset</Message.Header>
                  Take note that this asset does not communicate on regular
                  intervals
                </Message.Content>
              </Message>
            )}
          </Popup.Content>
        </Popup>
      )}
    </React.Fragment>
  );
};

export default ShowMessageFrequency;
