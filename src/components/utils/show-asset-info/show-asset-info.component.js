import React, { useState, useEffect, useContext } from "react";
import { MobXProviderContext } from "mobx-react";

import { Tab, Label, Menu } from "semantic-ui-react";
import ShowAlerts from "./alerts-show.component";
import ShowCurrentIssues from "./current-issues-show.component";

import ShowResourceUsage from "./resource-usage-show.component"

import _ from 'lodash'
import ShowInventory from "./inventory-show.component"

const ShowAssetInfo = (props) => {

  const tabIndexActive = props.defaultActiveIndex
    ? props.defaultActiveIndex
    : 0;
  const { commonStore } = useContext(MobXProviderContext);

  const [alerts, setAlerts] = useState({});
  const [inventory, setInventory] = useState({});
  const [current_issues, setCurrentIssues] = useState({});

  useEffect(() => {
    if (props.doRequest) {
      let paramsId = {
        type: props.type,
        id: props.id,
      };
      const inventoryPromise = commonStore.getData("inventory", paramsId);
      const alertPromise = commonStore.getData("alerts", paramsId);
      const currentIssuesPromise = commonStore.getData("current_issues", paramsId);

      Promise.all([inventoryPromise, alertPromise, currentIssuesPromise]).then(
        (response) => {
          setInventory(response[0].data);
          setAlerts(response[1].data);
          setCurrentIssues(response[2].data);
        }
      );
    }
  }, []);

  const panes = [
    {
      menuItem: "Network overview",
      render: () => (
        <Tab.Pane>
          <ShowResourceUsage asset={props.asset} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="alerts">
          Alerts{" "}
          {alerts && alerts.total_items > 0 && (
            <Label color="red">{alerts.total_items}</Label>
          )}
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane>
          <ShowAlerts alerts={alerts.alerts} totalItems={alerts.total_items} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="current_issues">
          Current Issues{" "}
          {current_issues && current_issues.total_items > 0 && (
            <Label color="yellow">{current_issues.total_items}</Label>
          )}
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane>
          <ShowCurrentIssues currentIssues={current_issues} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <React.Fragment>
      <ShowInventory inventory={inventory} />
      <Tab panes={panes} defaultActiveIndex={tabIndexActive} />
    </React.Fragment>
  );
};

export default ShowAssetInfo;
