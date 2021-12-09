const stepsDashboard = [
  {
    id: "welcome",
    title: "Welcome!",
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
  },
  {
    id: "menu",
    title: "Menu",
    text: `This menu can allow you to interact with different sections of the system`,
    attachTo: { element: ".sidebar-menu ", on: "right" },
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
  },
  {
    id: "policies",
    title: `<a href="dashboard/policies">Policies</a>`,
    text: `This section displays the existing policies on the system. A policy is a set of configuration parameters for the different checks and alerts of RoLaGuard. You can interact with the items on the list by clicking the actions.`,
    attachTo: { element: ".fa-shield-alt", on: "right" },
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
  },
  {
    id: "data_sources",
    title: `<a href="dashboard/data_collectors">Data Sources</a>`,
    text: `This section displays the existing data sources on the system. Also, you can interact with the items on the list by clicking the actions.`,
    attachTo: { element: ".fa-sitemap", on: "right" },
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
  },
  {
    id: "events_manager",
    title: `<a href="dashboard/events_manager">Events Manager</a>`,
    text: `This section can allow you to configure the notifications of the system.`,
    attachTo: { element: ".fa-project-diagram", on: "right" },
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
  },
  {
    id: "network_overview",
    title: `<a href="dashboard/resources_usage">Network Overview</a>`,
    text: `This section displays statistics about the existing devices on the network. Also, you can use the filters or search bar. It shows graphs by status, flow messages and signal strength. The list can allow you to interact with the items on the list by clicking on one.`,
    attachTo: { element: ".fa-chart-line", on: "right" },
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
  },
  {
    id: "inventory",
    title: `<a href="dashboard/inventory">Inventory</a>`,
    text: `This section lists the existing devices on the network. Also, you can use the filters or search bar. It shows graphs by vendor, data source and importance.The list can allow you to interact with the items on the list by clicking on one or checking the box to set importance or assign labels.`,
    attachTo: { element: ".fa-microchip", on: "right" },
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
  },
  {
    id: "alerts",
    title: `<a href="dashboard/alerts_review">Alerts</a>`,
    text: `This section displays the existing alerts on the system. Also, you can use the filters or search bar. It shows graphs by risk, description and data source. The list can allow you to interact with the items on the list by clicking on one.`,
    attachTo: { element: ".fa-exclamation-circle", on: "right" },
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
  },
  {
    id: "current_issues",
    title: `<a href="dashboard/current_issues">Current Issues</a>`,
    text: `This section displays the current issues on the network. While an alert is a specific event in time that can affect the network, an issue is a problem/vulnerability that is persistent. Also, you can use the filters or search bar. It shows graphs by risk, description and data source. The list can allow you to interact with the items on the list by clicking on one.`,
    attachTo: { element: ".fa-exclamation-triangle", on: "right" },
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
  },
  {
    id: "dashboard",
    title: "Dashboard",
    text: `This section displays a summary of the state of the network: the latest alerts on the system, number of devices, messages, etc. If you want to start the tour again you can click the button on this section.`,
    attachTo: { element: ".fa-tachometer-alt", on: "right" },
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
  },
  {
    id: "end",
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

export default stepsDashboard;
