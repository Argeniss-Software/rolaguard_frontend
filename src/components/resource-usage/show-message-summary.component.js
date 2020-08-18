import * as React from "react";
import { Icon, Popup } from "semantic-ui-react";
import NumberFormat from "react-number-format";

const ShowMessagesSummary = (props) => {
  return (
    <span>
      <Popup
        position="left center"
        flowing
        trigger={
          <span>
            <Icon
              color="green"
              name="arrow alternate circle down"
              type="icon"
            />
            <strong>
              <NumberFormat
                value={props.packets_down.percentage}
                displayType={"text"}
                suffix={"%"}
                decimalScale="1"
              />
            </strong>{" "}
            /
            <Icon color="orange" name="arrow alternate circle up" type="icon" />
            <strong>
              <NumberFormat
                value={props.packets_up.percentage}
                displayType={"text"}
                suffix={"%"}
                decimalScale="1"
              />
            </strong>{" "}
            /
            <Icon color="grey" name="exclamation triangle" type="icon" />
            <strong>
              <NumberFormat
                value={props.packets_lost.percentage}
                displayType={"text"}
                suffix={"%"}
                decimalScale="1"
              />
            </strong>
          </span>
        }
        position="bottom left"
      >
        <Popup.Header>Messages on the last 24 hours</Popup.Header>
        <Popup.Content>
          <div class="eight wide column">
            <div>
              <Icon
                color="green"
                name="arrow alternate circle down"
                type="icon"
              />
              Received:
              <strong>
                <NumberFormat
                  value={props.packets_down.total}
                  displayType={"text"}
                />{" "}
                (
                <NumberFormat
                  value={props.packets_down.percentage}
                  displayType={"text"}
                  suffix={"%"}
                  decimalScale="1"
                />
                )
              </strong>
            </div>
            <div>
              <Icon
                color="orange"
                name="arrow alternate circle up"
                type="icon"
              />
              Sent:
              <strong>
                <NumberFormat
                  value={props.packets_up.total}
                  displayType={"text"}
                />{" "}
                (
                <NumberFormat
                  value={props.packets_up.percentage}
                  displayType={"text"}
                  suffix={"%"}
                  decimalScale="1"
                />
                )
              </strong>
            </div>
            <div>
              <Icon color="grey" name="exclamation triangle" type="icon" />
              Lost:
              <strong>
                <NumberFormat
                  value={props.packets_lost.total}
                  displayType={"text"}
                />
                (
                <NumberFormat
                  value={props.packets_lost.percentage}
                  displayType={"text"}
                  suffix={"%"}
                  decimalScale="1"
                />
                )
              </strong>
            </div>
          </div>
          <div class="eight wide column">
            <div className="empty-container">
              <h1 className="empty-message">
                <i className="fas fa-info-circle" />
                <br />
                pie chart ?
              </h1>
            </div>
          </div>
        </Popup.Content>
      </Popup>
    </span>
  );
};

export default ShowMessagesSummary;
