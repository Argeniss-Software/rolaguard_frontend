import React, { useState, useEffect, useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import { Icon, Grid, Segment, Popup } from "semantic-ui-react";
import ShowAlerts from "./alerts-show.component";
import ShowCurrentIssues from "./current-issues-show.component";
import ShowResourceUsage from "./resource-usage-show.component";
import ShowInventory from "./inventory-show.component";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LoaderComponent from "../loader.component";
import PacketsGraph from "./packets-graph-component";
import AlertTimeLineGraph from "./alert-timeline-graph.component"

const ShowAssetInfo = (props) => {
  const [inventory, setInventory] = useState({});
  const [resource_usage, setResourceUsage] = useState({});
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { commonStore } = useContext(MobXProviderContext);

  useEffect(() => {
    if (props.type && props.id) {
      let paramsId = {
        type: props.type,
        id: props.id,
      };

      const resourceUsagePromise = commonStore.getData(
        "resource_usage",
        paramsId
      );
      const inventoryPromise = commonStore.getData("inventory", paramsId);

      Promise.all([inventoryPromise, resourceUsagePromise]).then((response) => {
        setInventory(response[0].data);
        setResourceUsage(response[1].data);
        setIsLoading(false);
      });
    }
  }, [props.id, props.type]);
  if (isLoading) {
    return <LoaderComponent loadingMessage="Loading asset info..." />;
  } else {
    return (
      <React.Fragment>
        <Grid columns="equal" style={{ marginTop: "1em" }}>
          <ShowInventory
            inventory={inventory}
            LayoutHeaderRight={
              <div className="pull-right">
                <span
                  style={{
                    color: "white",
                    fontStyle: "italic",
                    fontSize: "12px",
                  }}
                >
                  {copied ? "copied to clipboard... " : ""}
                </span>
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

        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column flex columns={8}>
              <AlertTimeLineGraph type={props.type} id={props.id} />
            </Grid.Column>

            <Grid.Column flex columns={8}>
              {props.type && props.id && (
                <ShowAlerts type={props.type} id={props.id} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column flex columns={16}>
              <h5
                className="ui inverted top attached header blue segment"
                style={{ height: "44px" }}
              >
                NETWORK OVERVIEW
              </h5>
              <Segment attached>
                <ShowResourceUsage asset={resource_usage} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
};

export default ShowAssetInfo;
