import React from "react";
import { Dropdown, Menu } from "semantic-ui-react";

const PerPageSelector = (props) => {
  const { id, type } = props;
  const options = [
    { key: 1, text: "10", value: 10 },
    { key: 2, text: "20", value: 20 },
    { key: 3, text: "50", value: 50 },
    { key: 3, text: "100", value: 100 },
    { key: 3, text: "500", value: 500 },
  ];
  return (
    <Menu compact>
      <Dropdown text="Dropdown" options={options} simple item />
    </Menu>
  );
};

export default PerPageSelector;