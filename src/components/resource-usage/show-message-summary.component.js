import * as React from "react";
import { Icon, Popup, Grid } from "semantic-ui-react";
import NumberFormat from "react-number-format";
import ShowPacketsStatisticsComponent from './show-packets-statistics.component'

const ShowMessagesSummary = (props) => {
  return (
    <span>
      <Popup
        trigger={
          <span>
            <Grid divided>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Icon
                    color="orange"
                    name="arrow alternate circle up"
                    type="icon"
                  />
                  <strong>
                    <NumberFormat
                      value={props.packets_up.total}
                      displayType={"text"}
                    />
                  </strong>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Icon
                    color="green"
                    name="arrow alternate circle down"
                    type="icon"
                  />
                  <strong>
                    <NumberFormat
                      value={props.packets_down.total}
                      displayType={"text"}
                    />
                  </strong>
                </Grid.Column>
                <Grid.Column width={4}>
                  {props.type == "device" && (
                    <React.Fragment>
                      <Icon
                        color="grey"
                        name="exclamation triangle"
                        type="icon"
                      />
                      <strong>
                        <NumberFormat
                          value={props.packets_lost.total}
                          displayType={"text"}
                        />
                      </strong>
                    </React.Fragment>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </span>
        }
      >
        <Popup.Header>Messages on the last 24 hours</Popup.Header>
        <Popup.Content>
          <ShowPacketsStatisticsComponent
            packets_down={props.packets_down}
            packets_up={props.packets_up}
            packets_lost={props.packets_lost}
            type={props.type}
          ></ShowPacketsStatisticsComponent>
        </Popup.Content>
      </Popup>
    </span>
  );
};

export default ShowMessagesSummary;
