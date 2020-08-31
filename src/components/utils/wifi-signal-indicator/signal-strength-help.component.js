import * as React from "react";
import { Table, Popup } from "semantic-ui-react";
import WifiIndicator from "react-wifi-indicator";
import DBMToSignalStrength from "./DBMToSignalStrength";
import SignalStrengthReferences from "./SignalStrengthReferences";
import statusImages from "./images";

const SignalStrengthHelp = (props) => {
  return (
    <React.Fragment>
      <Table compact="tiny" celled color="black">
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell textAlign="center"></Table.HeaderCell>
            <Table.HeaderCell textAlign="center"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {SignalStrengthReferences().map((r) => {
            return (
              <Table.Row key={r.value}>
                <Table.Cell textAlign="left">
                  <Popup
                    basic
                    trigger={
                      <WifiIndicator
                        strength={DBMToSignalStrength(r.value)}
                        statusImages={statusImages}
                        style={{
                          height: 20,
                          verticalAlign: "bottom",
                        }}
                      />
                    }
                    content={r.text}
                  ></Popup>
                </Table.Cell>
                <Table.Cell textAlign="left">
                  > {r.value} {r.unit}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
};

export default SignalStrengthHelp;
