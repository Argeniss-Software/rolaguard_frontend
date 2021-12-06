export default [
  {
    id: "welcome",
    text: [
      `
      <p>
      Welcome!
      </p>
      <p>
      ¿Are you ready to take the tour on RolaGuard?
      </p>
      `,
    ],
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
    text: `This menu can allow you to interact with different sections of the system. We recommend to start adding a Data source clicking on <a href="dashboard/data_collectors">data sources</a> option`,
    attachTo: { element: ".sidebar-menu ", on: "bottom" },
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
    id: "usage",
    title: "Usage",
    text: [
      "To use the tour service, simply inject it into your application and use it like this example.",
    ],
    attachTo: { element: ".usage-element", on: "bottom" },
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
    id: "centered-example",
    title: "Centered Shepherd Element",
    text: `But attachment is totally optional!\n \
    Without a target, a tour step will create an element that's centered within the view. \
    Check out the <a href="https://shepherdjs.dev/docs/">documentation</a> to learn more.`,
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
    id: "followup",
    title: "Learn more",
    text: "Star Shepherd on Github so you remember it for your next project",
    attachTo: { element: ".hero-followup", on: "top" },
    scrollTo: true,
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
