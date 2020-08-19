import * as React from "react";
import { Label } from "semantic-ui-react";

const ImportanceLabel = (props) => {
  /*
        This component render the importance label with the desired color and text.
        If the importance given is incorrect, the component will render a gray label
        with "UNKNOWN VALUE".
        
        props:
            importance: string, possible values: ["LOW", "MEDIUM", "HIGH"]
    */

  const { importance } = props;

  const possibleValues = ["LOW", "MEDIUM", "HIGH"];
  const colorMap = {
    LOW: "#fad732",
    MEDIUM: "#ff902b",
    HIGH: "#f05050",
  };

  if (possibleValues.includes(importance)) {
    return (
      <Label
        horizontal
        style={{
          backgroundColor: colorMap[importance],
          color: "white",
          borderWidth: 1,
          width: "100px",
        }}
      >
        {importance}
      </Label>
    );
  } else {
    return (
      <Label
        horizontal
        style={{
          backgroundColor: "gray",
          color: "white",
          borderWidth: 1,
          width: "100px",
        }}
      >
        UNKNOWN VALUE
      </Label>
    );
  }
};

export default ImportanceLabel;
