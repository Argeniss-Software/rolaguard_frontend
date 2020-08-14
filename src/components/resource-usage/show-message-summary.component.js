import * as React from "react";
import {Icon, Popup} from "semantic-ui-react";

const ShowMessagesSummary = (
  received,
  sended,
  lost,
  received_p,
  sended_p,
  lost_p
) => {
  return (
    <span>
      <Popup
        trigger={
          <span>
            <Icon
              color="green"
              name="arrow alternate circle down "
              type="icon"
            />
            <strong>{received_p}%</strong> /
            <Icon color="orange" name="arrow alternate circle up" type="icon" />
            <strong>{sended_p}%</strong> /
            <Icon color="grey" name="exclamation triangle" type="icon" />
            <strong>{lost_p}%</strong>
          </span>
        }
        position="bottom left"
      >
        <Popup.Header>Messages on the last 24 hours</Popup.Header>
        <Popup.Content>
          <div>
            <Icon
              color="green"
              name="arrow alternate circle down "
              type="icon"
            />
            Received:
            <strong>
              {received} ({received_p}%)
            </strong>
          </div>
          <div>
            <Icon color="orange" name="arrow alternate circle up" type="icon" />
            Sent:
            <strong>
              {sended} ({sended_p}%)
            </strong>
          </div>
          <div>
            <Icon color="grey" name="exclamation triangle" type="icon" />
            Lost:
            <strong>
              {lost} ({lost_p}%)
            </strong>
          </div>
        </Popup.Content>
      </Popup>
    </span>
  );
};

export default ShowMessagesSummary;
