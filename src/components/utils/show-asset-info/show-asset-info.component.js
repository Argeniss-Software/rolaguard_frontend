import React, { useState, useEffect, useContext } from "react";
import { MobXProviderContext } from "mobx-react";

import { Label, Icon, Grid, Segment, Popup} from "semantic-ui-react";
import ShowAlerts from "./alerts-show.component";
import ShowCurrentIssues from "./current-issues-show.component";

import ShowResourceUsage from "./resource-usage-show.component"

import _ from 'lodash'
import ShowInventory from "./inventory-show.component"
import { CopyToClipboard } from "react-copy-to-clipboard"
import AssetLink from "../../utils/asset-link.component"

const ShowAssetInfo = (props) => {

  const { commonStore } = useContext(MobXProviderContext);

  const [alerts, setAlerts] = useState({});
  const [inventory, setInventory] = useState({});
  const [current_issues, setCurrentIssues] = useState({});
  const [resource_usage, setResourceUsage] = useState({});
  const [copied, setCopied] = useState(false);
  useEffect(() => {
      let paramsId = {
        type: props.type,
        id: props.id,
      };

      const resourceUsagePromise = commonStore.getData("resource_usage", paramsId)
      const inventoryPromise = commonStore.getData("inventory", paramsId);
      const alertPromise = commonStore.getData("alerts", paramsId);
      const currentIssuesPromise = commonStore.getData("current_issues", paramsId);

      Promise.all([
        inventoryPromise,
        alertPromise,
        currentIssuesPromise,
        resourceUsagePromise,
      ]).then((response) => {
        setInventory(response[0].data);
        setAlerts(response[1].data);
        setCurrentIssues(response[2].data);
        setResourceUsage(response[3].data);
      });
    }, [props.id, props.type]);

  return (
    <React.Fragment>
      <Grid columns={16} columns="equal" style={{ marginTop: "1em" }}>
        <ShowInventory
          inventory={inventory}
          LayoutHeaderRight={
            <div class="pull-right">
              <span style={{color: 'white', fontStyle: 'italic',fontSize: '12px'}}>{copied ? 'copied to clipboard... ' : ""}</span>
              <Popup
                basic
                trigger={
                  <CopyToClipboard
                    text={window.location.href}
                    onCopy={() => setCopied(true)}
                  >
                    <Icon
                      name="external share"
                      inverted
                      style={{ cursor: "pointer" }}
                    />
                  </CopyToClipboard>
                }
                content="Press here to copy the link to clipboard for sharing"
              />
            </div>
          }
        />
      </Grid>
      <Grid columns={16} columns="equal">
        <Grid.Row>
          <Grid.Column flex key={16}>
            <h5 class="ui inverted top attached header">NETWORK OVERVIEW</h5>
            <Segment attached>
              <ShowResourceUsage asset={resource_usage} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid columns={16} columns="equal">
        <Grid.Row>
          <Grid.Column flex key={8}>
            <h5 class="ui inverted top attached header">
              CURRENT ISSUES{" "}
              {current_issues && current_issues.total_items > 0 && (
                <Label color="yellow">{current_issues.total_items}</Label>
              )}
            </h5>
            <Segment attached>
              <ShowCurrentIssues currentIssues={current_issues} />
            </Segment>
          </Grid.Column>

          <Grid.Column flex key={8}>
            <h5 class="ui inverted top attached header">
              ALERTS{" "}
              {alerts && alerts.total_items > 0 && (
                <Label color="red">{alerts.total_items}</Label>
              )}
            </h5>
            <Segment attached>
              <ShowAlerts
                alerts={alerts.alerts}
                totalItems={alerts.total_items}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
};

export default ShowAssetInfo;
