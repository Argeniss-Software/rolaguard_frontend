import * as React from "react";
import { Table, Popup } from "semantic-ui-react";
import WifiIndicator from "react-wifi-indicator";
import DBMToSignalStrength from "./DBMToSignalStrength";
import SignalStrengthReferences from "./SignalStrengthReferences";
import statusImages from "./images";

const SignalStrengthHelp = (props) => {
  return (
    <React.Fragment>
      <Table compact="very" size="large" flowing celled color="black">
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell textAlign="center"></Table.HeaderCell>
            <Table.HeaderCell textAlign="center"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {SignalStrengthReferences().map((r, index) => {
            return (
              <Table.Row key={r.value}>
                <Table.Cell textAlign="left">
                  <Popup
                    basic
                    size="mini"
                    trigger={
                      <WifiIndicator
                        strength={DBMToSignalStrength(
                          index === 5 ? r.value - 1 : r.value
                        )}
                        statusImages={statusImages}
                        style={{
                          height: 20,
                          verticalAlign: "bottom",
                        }}
                      />
                    }
                    content={
                      DBMToSignalStrength(
                    index === 5 ? r.value - 1 : r.value,
                    true
                  )}
                    
                  />
                  <small>
                    {DBMToSignalStrength(
                      index === 5 ? r.value - 1 : r.value,
                      true
                    )}
                  </small>
                </Table.Cell>
                <Table.Cell textAlign="left">
                  {index > 4 ? (
                    <i className="fa fa-less-than"></i>
                  ) : (
                    <i className="fa fa-greater-than-equal"></i>
                  )}{" "}
                  {r.value} {r.unit}
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
