function StepsDashboardComponent(props) {
  const steps = [
    {
      id: "welcome",
      title: `<b> Welcome!<b>`,
      text: "Are you ready to take the Tour on RolaGuard?",
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "cancel",
          classes: "shepherd-button-secondary",
          text: "Exit",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard");
        },
      },
    },
    {
      id: "menu",
      title: "<b>Menu<b>",
      text: `This menu allows you to interact with different sections of the system`,
      attachTo: { element: ".sidebar-menu ", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          text: "Next",
          classes: "shepherd-button-primary",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard");
        },
      },
    },
    {
      id: "policies_step",
      title: `<b>Policies<b>`,
      text: `Continue to learn more about this section`,
      attachTo: { element: "#policies", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/policies");
        },
      },
    },
    {
      id: "policies",
      title: `<b>Policies<b>`,
      text: "This section displays the existing policies on the system. A policy is a set of configuration parameters for the different checks and alerts of RoLaGuard. You can interact with the items on the list by clicking the actions.",
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/policies");
        },
      },
    },
    {
      id: "new_policy",
      title: `<b>New Policy<b>`,
      text: `This button allows you to open a form to add a new policy.`,
      attachTo: { element: "#new_policy", on: "left" },
      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            props.history.push("/dashboard/policies");
            resolve();
          }, 50);
        });
      },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/policies");
        },
      },
    },
    {
      id: "data_sources",
      title: `<b>Data Sources<b>`,
      text: "Continue to learn more about this section",
      attachTo: { element: "#data_sources", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/data_collectors");
        },
      },
    },
    {
      id: "data_sources",
      title: `<b>Data Sources<b>`,
      text: `This section displays the existing data sources on the system. Also, you can interact with the items on the list by clicking the actions.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/data_collectors");
        },
      },
    },
    {
      id: "new_data_sources",
      title: `<b>New Data Source<b>`,
      text: "This button allows you to open a form to add a new data source",
      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            props.history.push("/dashboard/data_collectors");
            resolve();
          }, 50);
        });
      },
      attachTo: { element: "#new_data_source", on: "left" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/data_collectors");
        },
      },
    },
    {
      id: "events_manager",
      title: `<b>Events Manager<b>`,
      text: `Continue to learn more about this section`,
      attachTo: { element: "#events_manager", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/events_manager");
        },
      },
    },
    {
      id: "events_manager",
      title: `<b>Events Manager<b>`,
      text: `This section allows you to configure the system notifications.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/events_manager");
        },
      },
    },
    {
      id: "sources",
      title: `<b>Sources<b>`,
      text: `These switches allow you to select which data sources should send notifications.`,
      attachTo: { element: "#sources", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/events_manager");
          document.getElementById("sources").click();
        },
        hide: () => {
          document.getElementById("sources").click();
        },
      },
    },
    {
      id: "triggers",
      title: `<b>Triggers<b>`,
      text: `These switches allow you to configure which types of alerts will generate notifications.`,
      attachTo: { element: "#triggers", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/events_manager");
          document.getElementById("triggers").click();
        },
        hide: () => {
          document.getElementById("triggers").click();
        },
      },
    },
    {
      id: "action",
      title: `<b>Action<b>`,
      text: `These switches allow you to configure the type of notifications to receive: push or email notifications.`,
      attachTo: { element: "#action", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/events_manager");
          document.getElementById("action").click();
        },
        hide: () => {
          document.getElementById("action").click();
        },
      },
    },
    {
      id: "save",
      title: `<b>Save<b>`,
      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            props.history.push("/dashboard/events_manager");
            resolve();
          }, 50);
        });
      },
      text: `Don’t forget to click the save button before exiting this section if you made changes.`,
      attachTo: { element: "#save_button", on: "left" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/events_manager");
        },
      },
    },
    {
      id: "network_overview",
      title: `<b>Network Overview<b>`,
      text: `Continue to learn more about this section`,
      attachTo: { element: "#network_overview", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/resources_usage");
        },
      },
    },
    {
      id: "network_overview",
      title: `<b>Network Overview<b>`,
      text: `This section displays statistics about the existing devices on the network. Also, you can use the filters or search bar. It shows graphs by status, flow messages and signal strength. The list allows you to interact with the items on the list by clicking on one.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/resources_usage");
        },
      },
    },
    {
      id: "inventory",
      title: `<b>Inventory<b>`,
      text: `Continue to learn more about this section`,
      attachTo: { element: "#inventory", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/inventory");
        },
      },
    },
    {
      id: "inventory",
      title: `<b>Inventory<b>`,
      text: `This section lists the existing devices on the network. Also, you can use the filters or search bar. It shows graphs by vendor, data source and importance.The list allows you to interact with the items on the list by clicking on one or checking the box to set importance or assign labels.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/inventory");
        },
      },
    },
    {
      id: "alerts",
      title: `<b>Alerts<b>`,
      text: `Continue to learn more about this section`,
      attachTo: { element: "#alerts", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/alerts_review");
        },
      },
    },
    {
      id: "alerts",
      title: `<b>Alerts<b>`,
      text: `This section displays the existing alerts on the system. Also, you can use the filters or search bar. It shows graphs by risk, description and data source. The list allows you to interact with the items on the list by clicking on one.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/alerts_review");
        },
      },
    },
    {
      id: "current_issues",
      title: `<b>Current Issues<b>`,
      text: `Continue to learn more about this section`,
      attachTo: { element: "#current_issues", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/current_issues");
        },
      },
    },
    {
      id: "current_issues",
      title: `<b>Current Issues<b>`,
      text: `This section displays the current issues on the network. While an alert is a specific event in time that can affect the network, an issue is a problem/vulnerability that is persistent. Also, you can use the filters or search bar. It shows graphs by risk, description and data source. The list allows you to interact with the items on the list by clicking on one.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard/current_issues");
        },
      },
    },
    {
      id: "dashboard",
      title: "<b>Dashboard<b>",
      text: `Continue to learn more about this section`,
      attachTo: { element: "#dashboard", on: "right" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard");
        },
      },
    },
    {
      id: "dashboard",
      title: "<b>Dashboard<b>",
      text: `This section displays a summary of the state of the network: the latest alerts on the system, number of devices, messages, etc. If you want to start the tour again you can click the button on this section.`,
      attachTo: { element: ".app-body-container" },
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Next",
        },
      ],
      when: {
        show: () => {
          props.history.push("/dashboard");
        },
      },
    },
    {
      id: "end",
      title: "<b>Tour finished<b>",
      text: `Thanks for taking the tour on RolaGuard!`,
      buttons: [
        {
          type: "back",
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: "next",
          classes: "shepherd-button-primary",
          text: "Done",
        },
      ],
    },
  ];
  return steps;
}

export default StepsDashboardComponent;
