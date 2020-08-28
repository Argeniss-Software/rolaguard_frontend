import * as React from "react";
import { MobXProviderContext, observer } from "mobx-react";
import {
  Table,
  Icon,
  Button,
  Message,
  Form,
  Divider,
} from "semantic-ui-react";
import Validation from "../../util/validation";
import EmptyComponent from "../utils/empty.component";
import LoaderComponent from "../utils/loader.component";

import "./keys-manager.component.css";

const KeysManager = (props) => {
  const { keysStore } = React.useContext(MobXProviderContext);
  const [disabled, setDisabled] = React.useState(true);
  const [newKey, setNewKey] = React.useState("");

  React.useEffect(() => {
    keysStore.getKeysFromAPI();
  }, []);

  const handleInput = (input) => {
    const key = input.target.value;
    if (Validation.isValidKeyIncomplete(key)) {
      setNewKey(key);
      setDisabled(!Validation.isValidKey(key));
    }
  };

  const saveKey = () => {
    keysStore.addKey(newKey);
    setNewKey("");
    setDisabled(true);
  };

  const deleteKey = (key) => {
    keysStore.deleteKey(key);
  };

  return (
    <React.Fragment>
      {keysStore.hasError && (
        <div style={{ textAlign: "center" }}>
          <Message visible error header="Oops!" style={{ maxWidth: "100%" }}>
            Something went wrong! Try again later or{" "}
            <a href="#" onClick={() => keysStore.getKeysFromAPI()}>
              reload this component
            </a>
            .
          </Message>
        </div>
      )}

      {!keysStore.hasError && (
        <div className="keys-manager-top">
          <div className="keys-manager-wrapper">
            <Form onSumbit={saveKey}>
              <Table
                width="570px"
                className="animated fadeIn keys-table"
                compact="very"
              >
                <Table.Header>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>
                    <p style={{ width: "430px", textAlign: "center" }}>KEYS</p>
                  </Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {/** Keys list */}
                  {!!keysStore.count &&
                    keysStore.keys.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell className="icon-cell">
                          <i className="fas fa-key" />
                        </Table.Cell>
                        <Table.Cell className="key-cell">
                          {item.key && item.key.toUpperCase()}
                        </Table.Cell>
                        <Table.Cell className="action-cell">
                          <i
                            className="fas fa-trash"
                            onClick={() => deleteKey(item.key)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}

                  {/** Empty component */}
                  {!keysStore.count && !keysStore.isLoading && (
                    <React.Fragment>
                      <Table.Row>
                        <Table.Cell />
                        <Table.Cell>
                          <EmptyComponent
                            style={{ width: "570px" }}
                            className="animated fadeIn"
                            emptyMessage="No keys found"
                          />
                        </Table.Cell>
                        <Table.Cell />
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell colSpan="3">
                          <Divider />
                        </Table.Cell>
                      </Table.Row>
                    </React.Fragment>
                  )}

                  {/** Loader component */}
                  {keysStore.isLoading && (
                    <React.Fragment>
                      <Table.Row>
                        <Table.Cell />
                        <Table.Cell>
                          <LoaderComponent
                            className="animated fadeIn"
                            loadingMessage="loading..."
                          />
                        </Table.Cell>
                        <Table.Cell />
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell colSpan="3">
                          <Divider />
                        </Table.Cell>
                      </Table.Row>
                    </React.Fragment>
                  )}

                  {/** Create new key input */}
                  <Table.Row>
                    <Table.Cell className="icon-cell imput-row">
                      <Icon name="plus" />
                    </Table.Cell>
                    <Table.Cell className="key-cell">
                      <Form.Input
                        autocomplete="off"
                        required
                        fluid
                        transparent
                        placeholder="Add new key"
                        onChange={handleInput}
                        value={newKey}
                      />
                    </Table.Cell>
                    <Table.Cell className="action-cell">
                      <Button
                        disabled={disabled}
                        onClick={(e) => {
                          e.preventDefault();
                          saveKey();
                        }}
                      >
                        save
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default observer(KeysManager);
