import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  Form,
  Label,
  Icon,
  Button,
  Message,
  Table,
  Checkbox,
} from "semantic-ui-react";
import Validation from "../util/validation";
import LoaderComponent from "./utils/loader.component";

import "./data_collectors.new.component.css";
import API from "../util/api";
import AuthStore from "../stores/auth.store";
import moment from "moment";

@inject("dataCollectorStore", "messageStore", "policyStore")
@observer
class DataCollectorsNewComponent extends React.Component {
  TEST_TIMEOUT = 30; //timeout seconds to wait for test connection results
  TESTRESULT_POLL_SEC = 5; //poll the api to get test connection results every 5 seconds

  subscriberId = null;
  dataCollectorId = null;

  constructor(props) {
    super(props);

    this.state = {
      dataCollector: {
        name: "",
        description: "",
        ip: "",
        port: "",
        user: "",
        password: "",
        topics: [],
        ssl: false,
        data_collector_type_id: null,
        policy_id: null,
        gateway_id: null,
      },
      types: [],
      policies: [],
      ttn_gateways: [],
      selected_gateways: [],
      selectAllGateways: false,
      isGettingGateways: false,
      errorGateways: false,
      finishedGateways: false,
      newTopic: "",
      isSaving: false,
      isLoading: false,
      isTesting: false,
      typeForm: "Add",
      error: null,
      errorTesting: false,
      testingResult: "",
      testSuccess: false,
      title: "New Data Source",
    };
  }

  handleChange = (e, { name, value }) => {
    let dataCollector = this.state.dataCollector;
    if (name === "ssl") {
      dataCollector["ssl"] = !dataCollector["ssl"];
    } else {
      dataCollector[name] = value;
    }
    this.setState({ dataCollector });
  };

  handleChangeOnNewTopic = (e, { name, value }) => {
    this.setState({ newTopic: value });
  };

  handleNewTopic = () => {
    let { dataCollector, newTopic } = this.state;
    dataCollector.topics.push(newTopic);
    newTopic = "";
    this.setState({ dataCollector, newTopic });
  };

  removeTopic = (index) => {
    let dataCollector = this.state.dataCollector;
    dataCollector.topics.splice(index, 1);
    this.setState({ dataCollector });
  };

  toggleSingleSelect(item, index, event) {
    let { ttn_gateways, dataCollector } = this.state;
    ttn_gateways[index].selected = !ttn_gateways[index].selected;
    dataCollector.gateway_id = ttn_gateways
      .filter((gateway) => gateway.selected)
      .map((gateway) => gateway.gateway_id.replace("eui-", ""))
      .join();

    this.setState({
      selectAll: ttn_gateways.every((gateway) => gateway.selected),
      ttn_gateways: ttn_gateways,
      dataCollector: dataCollector,
    });
  }

  toggleSelection(event) {
    const { selectAllGateways, ttn_gateways, dataCollector } = this.state;
    ttn_gateways.forEach((gateway) => {
      gateway.selected = !selectAllGateways;
      return gateway;
    });
    dataCollector.gateway_id = ttn_gateways
      .filter((gateway) => gateway.selected)
      .map((gateway) => gateway.gateway_id.replace("eui-", ""))
      .join();

    this.setState({
      selectAllGateways: !selectAllGateways,
      ttn_gateways: ttn_gateways,
      dataCollector: dataCollector,
    });
  }

  handleSubmit = () => {
    this.setState({ isSaving: true });
    if (this.state.typeForm === "Add") {
      this.props.dataCollectorStore
        .saveDataCollector(this.state.dataCollector)
        .then(() => {
          this.clearForm();
          this.setState({ isSaving: false });
          this.props.history.push("/dashboard/data_collectors");
        })
        .catch((err) => {
          console.error(err);
          this.setState({ isSaving: false, error: err });
          setTimeout(() => this.setState({ error: null }), 5000);
        });
    } else {
      this.props.dataCollectorStore
        .updateDataCollector(
          this.state.dataCollectorId,
          this.state.dataCollector
        )
        .then(() => {
          this.setState({ isSaving: false });
          this.props.history.push("/dashboard/data_collectors");
        })
        .catch((err) => {
          console.error(err);
          this.setState({ isSaving: false, error: err });
          setTimeout(() => this.setState({ error: null }), 5000);
        });
    }
  };

  clearForm = () => {
    this.setState({
      dataCollector: {
        name: "",
        description: "",
        ip: "",
        port: "",
        user: "",
        password: "",
        topics: [],
        ssl: false,
        data_collector_type_id: null,
        policy_id: null,
        gateway_id: null,
      },
      newTopic: "",
    });
  };

  componentWillMount() {
    const dataCollectorId = this.props.match.params.data_collector_id;
    const { dataCollector } = this.state;

    this.props.dataCollectorStore
      .getDataCollectorTypes()
      .then((response) => {
        const types = response.data.map((type) => {
          return {
            key: type.id,
            value: type.id,
            text: type.name,
            code: type.type,
          };
        });

        this.setState({ types });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, error: err });
        setTimeout(() => this.setState({ error: null }), 5000);
      });

    this.props.policyStore
      .query({ page: 1, size: 100000 })
      .then((response) => {
        const defaultPolicy = response.data.find((policy) => policy.isDefault);
        const policies = response.data.map((policy) => {
          return {
            key: policy.id,
            value: policy.id,
            text: policy.name,
          };
        });
        if (defaultPolicy) {
          dataCollector.policy_id = defaultPolicy.id;
        }
        this.setState({ policies });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, error: err });
        setTimeout(() => this.setState({ error: null }), 5000);
      });

    if (dataCollectorId) {
      this.setState({ isLoading: true, title: "Edit Data Source" });
      this.props.dataCollectorStore
        .getDataCollectorById(dataCollectorId)
        .then((response) => {
          const {
            name,
            description,
            ip,
            port,
            user,
            password,
            ssl,
            topics,
            data_collector_type_id,
            policy_id,
            gateway_id,
          } = response.data;
          const dataCollector = {
            name,
            description,
            ip,
            port,
            user,
            password,
            ssl,
            topics,
            data_collector_type_id,
            policy_id,
            gateway_id,
          };
          this.setState({ dataCollector, dataCollectorId, typeForm: "Edit" });
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ isLoading: false, error: err });
          setTimeout(() => this.setState({ error: null }), 5000);
        });
    }
  }

  async pollTestResults(start, dataCollectorId) {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          console.log(
            "Waiting for response... " + -start.diff(Date.now(), "seconds")
          );
          const testResponse = await API.get("data_collectors/test", {
            params: { data_collector_id: dataCollectorId },
            timeout: 30000,
            headers: { Authorization: "Bearer " + AuthStore.access_token },
          });
          const data = testResponse.data;
          if (
            data["haveResponse"] ||
            -start.diff(Date.now(), "seconds") >= this.TEST_TIMEOUT
          ) {
            clearTimeout(intervalId);
            resolve(testResponse);
          }
        } catch (e) {
          clearTimeout(intervalId);
          reject(e);
        }
      }, this.TESTRESULT_POLL_SEC * 1000);
    });
  }

  async testConnection() {
    this.setState({
      isTesting: true,
      finishedTesting: false,
      testingResult: "",
    });
    //send message to queue for Orchestrator to pick up and try to connect
    let response = await API.post(
      "data_collectors/test",
      this.state.dataCollector,
      {
        headers: { Authorization: "Bearer " + AuthStore.access_token },
      }
    );
    const dataCollectorId = response.data["id"]; //uuid with temporary id for the data collector
    // here we have also a message in response.data['message'] which could be shown in an alert or something...
    // subscribe to receive test events from datacollector
    const start = moment(Date.now());
    let testSuccess = false;
    let testResponse = null;
    let result = "Timeout - Connection test unsuccessful";
    try {
      testResponse = await this.pollTestResults(start, dataCollectorId);
      const data = testResponse["data"];
      if (data["haveResponse"]) {
        result = data["type"] + ": " + data["message"];
        testSuccess = data["type"] === "SUCCESS";
      }
    } catch (error) {
      testSuccess = false;
      result = "Test unsuccessful: " + error.message;
    }
    this.setState({
      isTesting: false,
      finishedTesting: true,
      testSuccess: testSuccess,
      testingResult: result,
    });
    return testSuccess;
  }

  getUserGateways = () => {
    this.setState({ isGettingGateways: true });
    this.props.dataCollectorStore
      .saveTTNCredentials(
        this.state.dataCollector.user,
        this.state.dataCollector.password
      )
      .then((response) => {
        if (response.status === 200) {
          this.props.dataCollectorStore
            .getTTNGateways()
            .then((response) => {
              const ttn_gateways = response.data.map((gateway, index) => {
                return {
                  key: index,
                  gateway_id: gateway.id,
                  description: gateway.description,
                };
              });

              this.setState({
                ttn_gateways,
                isGettingGateways: false,
                errorGateways: false,
                finishedGateways: true,
              });
            })
            .catch((err) => {
              console.error(err);
              this.setState({
                isLoading: false,
                error: err,
                isGettingGateways: false,
              });
              setTimeout(() => this.setState({ error: null }), 5000);
            });
        } else {
          this.setState({
            isGettingGateways: false,
            errorGateways: true,
            finishedGateways: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          isGettingGateways: false,
          errorGateways: true,
          finishedGateways: true,
        });
      });
  };

  render() {
    const {
      name,
      description,
      ip,
      port,
      user,
      password,
      ssl,
      topics,
      data_collector_type_id,
      policy_id,
      gateway_id,
    } = this.state.dataCollector;
    const {
      newTopic,
      isLoading,
      isSaving,
      title,
      error,
      types,
      policies,
      isTesting,
      isGettingGateways,
      ttn_gateways,
      testSuccess,
      selectAllGateways,
    } = this.state;

    const type = types.find((t) => t.key === data_collector_type_id);
    const dataCollectorTypeCode = type ? type.code : null;

    const validForm =
      name &&
      name.length <= 120 &&
      (!description || description.length <= 1000) &&
      (dataCollectorTypeCode === "ttn_collector" ||
        (Validation.isValidIp(ip) && Validation.isValidPort(port))) &&
      data_collector_type_id &&
      policy_id &&
      ((dataCollectorTypeCode !== "ttn_collector" &&
        (!user || (user && user.length < 120)) &&
        (!password || (password && password.length < 120))) ||
        (dataCollectorTypeCode === "ttn_collector" &&
          user &&
          user.length < 120 &&
          password &&
          password.length < 120 &&
          gateway_id));

    return (
      <div className="app-body-container-view">
        <div className="animated fadeIn animation-view dashboard">
          <div className="view-header">
            {/* HEADER TITLE */}
            <h1>{title}</h1>
          </div>

          {/* VIEW BODY */}
          <div className="view-body">
            <div>
              {isLoading && (
                <LoaderComponent loadingMessage="Loading data source..." />
              )}
              {!isLoading && (
                <Form
                  className="form-label form-css-label text-center"
                  onSubmit={this.handleSubmit}
                  warning
                  noValidate="novalidate"
                  autoComplete="off"
                  style={{ marginTop: "2em" }}
                >
                  <Form.Group>
                    <Form.Field required>
                      <Form.Input
                        required
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                        error={!!name && name.length > 120}
                      >
                        <input />
                        <label>Name</label>
                      </Form.Input>
                    </Form.Field>
                    <Form.Field required>
                      <div className="dropdown-label-wrapper">
                        <label className="dropdown-label">Type</label>
                        <Form.Dropdown
                          search
                          selection
                          options={types}
                          name="data_collector_type_id"
                          value={data_collector_type_id}
                          onChange={this.handleChange}
                        />
                      </div>
                    </Form.Field>
                    <Form.Field required>
                      <div className="dropdown-label-wrapper">
                        <label className="dropdown-label">Policy</label>
                        <Form.Dropdown
                          search
                          selection
                          options={policies}
                          name="policy_id"
                          value={policy_id}
                          onChange={this.handleChange}
                        />
                      </div>
                    </Form.Field>
                  </Form.Group>
                  <Form.Group>
                    <Form.Field>
                      {/* <label>Description</label> */}
                      <Form.Input
                        required
                        name="description"
                        value={description}
                        onChange={this.handleChange}
                        error={!!description && description.length > 1000}
                      >
                        <input />
                        <label>Description</label>
                      </Form.Input>
                    </Form.Field>
                  </Form.Group>
                  {dataCollectorTypeCode !== "ttn_collector" && (
                    <Form.Group>
                      <Form.Field required>
                        <Form.Input
                          required
                          name="ip"
                          value={ip}
                          onChange={this.handleChange}
                          error={!!ip && !Validation.isValidIp(ip)}
                        >
                          <input />
                          <label>Server IP Address</label>
                        </Form.Input>
                      </Form.Field>
                      <Form.Field required>
                        <Form.Input
                          required
                          name="port"
                          value={port}
                          onChange={this.handleChange}
                          error={!!port && !Validation.isValidPort(port)}
                        >
                          <input />
                          <label>Port</label>
                        </Form.Input>
                      </Form.Field>
                    </Form.Group>
                  )}
                  <Form.Group>
                    <Form.Field
                      required={dataCollectorTypeCode === "ttn_collector"}
                    >
                      <Form.Input
                        required
                        name="user"
                        value={user}
                        onChange={this.handleChange}
                        error={!!user && user.length > 120}
                      >
                        <input />
                        <label>User</label>
                      </Form.Input>
                    </Form.Field>
                    <Form.Field
                      required={dataCollectorTypeCode === "ttn_collector"}
                    >
                      <Form.Input
                        required
                        type="password"
                        autoComplete="new-password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        error={!!password && password.length > 120}
                      >
                        <input />
                        <label>Password</label>
                      </Form.Input>
                    </Form.Field>
                    {dataCollectorTypeCode === "ttn_collector" && (
                      <Form.Button
                        type="button"
                        disabled={!user || !password || isLoading}
                        loading={isGettingGateways}
                        content="Get Gateways"
                        onClick={() => this.getUserGateways()}
                        floated="left"
                      />
                    )}
                  </Form.Group>

                  {dataCollectorTypeCode !== "ttn_collector" && (
                    <div>
                      <Form.Group>
                        <Form.Field required className="mb0">
                          <Form.Input
                            className="input-with-button-width d-inline-block"
                            name="new-topic"
                            value={newTopic}
                            onChange={this.handleChangeOnNewTopic}
                          >
                            <input />
                            <label>New topic</label>
                          </Form.Input>
                          <Button
                            type="button"
                            onClick={this.handleNewTopic}
                            content="Add"
                            disabled={
                              newTopic.length === 0 || isSaving || isLoading
                            }
                          />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field>
                          <div className="d-flex">
                            {topics && topics.length === 0 && (
                              <div className="mh-sm">
                                <p>No topics yet</p>
                              </div>
                            )}
                            {topics &&
                              topics.map((topic, index) => {
                                return (
                                  <div
                                    key={"topic-" + index}
                                    className="animated fadeIn mh-sm"
                                  >
                                    <Label>
                                      {topic}
                                      <Icon
                                        name="close"
                                        onClick={() => this.removeTopic(index)}
                                      />
                                    </Label>
                                  </div>
                                );
                              })}
                          </div>
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field>
                          <Form.Checkbox
                            className="ssl-mode-checkbox"
                            label="SSL mode?"
                            name="ssl"
                            checked={ssl}
                            onChange={this.handleChange}
                          />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        {!ssl && (
                          <div className="flex-center">
                            <Message
                              warning
                              size="small"
                              header="Security Warning!"
                              list={[
                                "If you don't enable SSL, credentials will be sent in clear text.",
                              ]}
                            />
                          </div>
                        )}
                      </Form.Group>
                    </div>
                  )}
                  {
                    <span>
                      {this.state.errorGateways && (
                        <Label basic color={"red"} size="medium">
                          An error ocurred while trying to get the gateways.
                        </Label>
                      )}
                      {!this.state.errorGateways &&
                        this.state.finishedGateways &&
                        ttn_gateways.length === 0 && (
                          <Label basic color={"red"} size="medium">
                            No gateways were found for this account.
                          </Label>
                        )}
                    </span>
                  }
                  {this.state.finishedGateways && ttn_gateways.length > 0 && (
                    <Form.Group grouped>
                      <Table
                        className="animated fadeIn"
                        basic="very"
                        compact="very"
                      >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>
                              <Checkbox
                                checked={selectAllGateways}
                                onChange={(e) => this.toggleSelection(e)}
                              />
                            </Table.HeaderCell>

                            <Table.HeaderCell>Gateway ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {ttn_gateways.map((gateway, index) => {
                            return (
                              <Table.Row
                                key={index}
                                style={{ cursor: "pointer" }}
                              >
                                <Table.Cell>
                                  <Checkbox
                                    checked={gateway.selected}
                                    onChange={(event) =>
                                      this.toggleSingleSelect(
                                        gateway,
                                        index,
                                        event
                                      )
                                    }
                                  />
                                </Table.Cell>
                                <Table.Cell>{gateway.gateway_id}</Table.Cell>

                                <Table.Cell>{gateway.description}</Table.Cell>
                              </Table.Row>
                            );
                          })}

                          {console.log(ttn_gateways)}
                        </Table.Body>
                      </Table>
                    </Form.Group>
                  )}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Form.Button
                        type="button"
                        disabled={!validForm || isLoading || isSaving}
                        loading={isTesting}
                        content="Test connection"
                        style={{ marginTop: 25 }}
                        onClick={() => this.testConnection()}
                      />
                      <span>
                        {this.state.finishedTesting && (
                          <Label basic color={testSuccess ? "green" : "red"}>
                            {this.state.testingResult}
                          </Label>
                        )}
                      </span>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Form.Button
                        type="button"
                        loading={isLoading || isSaving}
                        disabled={isLoading || isSaving || isTesting}
                        content="Cancel"
                        style={{ marginTop: 25 }}
                        onClick={() =>
                          this.props.history.push("/dashboard/data_collectors")
                        }
                      />
                      <Form.Button
                        color="green"
                        disabled={
                          !validForm ||
                          isLoading ||
                          isSaving ||
                          isTesting ||
                          !testSuccess
                        }
                        loading={isSaving}
                        content="Save"
                        style={{ marginTop: 25, marginLeft: 10 }}
                      />
                    </div>
                  </div>
                  {error && (
                    <Form.Group style={{ height: "8rem" }}>
                      <Message
                        negative
                        header="Error!"
                        list={[
                          "There was an error processing your request.",
                          "Try again later or contact support.",
                        ]}
                      />
                    </Form.Group>
                  )}
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataCollectorsNewComponent;
