import faker from "faker";
import React, { useState, useContext } from "react";
import { Search, Grid, Header, Segment, Label, Table } from "semantic-ui-react";
import { MobXProviderContext } from "mobx-react";
import ShowDeviceIcon from "../show-device-icon.component";
import ShowDeviceState from "../show-device-state.component";
import AssetIdComponent from "../asset-id.component";

const categoryLayoutRenderer = ({ categoryContent, resultsContent }) => {
  return (
    <div class="category">
      {categoryContent}
      <div className="results">{resultsContent}</div>
    </div>
  );
};

const categoryRenderer = ({ name }) => {
  return <div class="name">{name}</div>;
};

const resultRenderer = (data) => {
  return (
    <React.Fragment>
      <div key="content" className="content">
        <div className="price">
          <Label color="black">{data.data_collector}</Label>
        </div>
        <div className="title">
          <ShowDeviceState state={data.connected} />
          <ShowDeviceIcon type={data.type}></ShowDeviceIcon>&nbsp;
          <AssetIdComponent type={data.type} hexId={data.hex_id} id={data.id} />
        </div>

        <div>
          <Grid columns="equal" stretched style={{ width: "100%" }} celled>
            <Grid.Row>
              <Grid.Column>Name:</Grid.Column>
              <Grid.Column width={4}>
                <strong>{data.name}</strong>
              </Grid.Column>
              <Grid.Column width={2}>App name:</Grid.Column>
              <Grid.Column width={8}>
                <strong>{data.app_name}</strong>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>Join EUI:</Grid.Column>
              <Grid.Column width={4}>
                <strong>{data.join_eui}</strong>
              </Grid.Column>
              <Grid.Column widht={2}>Vendor:</Grid.Column>
              <Grid.Column width={8}>
                <strong>{data.vendor}</strong>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};
const getResults = () =>
  _.times(5, () => ({
    title: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    image: faker.internet.avatar(),
    price: faker.finance.amount(0, 100, 2, "$"),
    other: "other",
  }));

const source = _.range(0, 3).reduce((memo) => {
  const name = faker.hacker.noun();

  // eslint-disable-next-line no-param-reassign
  memo[name] = {
    name,
    results: getResults(),
  };

  return memo;
}, {});

const handleResultSelect = (e, { result }) => {
  setValue(result.title);
  // todo:_ redirecT!
}

const AssetShowSearchComponent = (props) => {
  const { commonStore } = useContext(MobXProviderContext);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");
  const [debug, setDebug] = useState(false);

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value);
    commonStore.searchAssets(value).then((data) => {
      const { devices, gateways } = data.data;
      //items_ids, total_pages, total_items
      setResults({
        devices: {
          name: "Devices",
          results: devices.items,
        },
        gateways: {
          name: "Gateways",
          results: gateways.items,
        },
      });
      setIsLoading(false);
    });
  };

  return (
    <Grid>
      <Grid.Column width={debug ? 8 : 16}>
        <Search
          fluid
          placeholder="Find device or gateway"
          style={{ width: "100%" }}
          input={{ icon: "search", iconPosition: "left", style: {width: "100%"} }}
          category
          categoryLayoutRenderer={categoryLayoutRenderer}
          categoryRenderer={categoryRenderer}
          loading={isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 2000, {
            leading: true,
          })}
          resultRenderer={resultRenderer}
          results={results}
          value={value}
        />
      </Grid.Column>
      {debug && (
        <Grid.Column width={debug ? 8 : 16}>
          <Segment>
            <Header>State</Header>
            <pre style={{ overflowX: "auto" }}>
              {JSON.stringify({ isLoading, value, results }, null, 2)}
            </pre>
            <Header>Options</Header>
            <pre style={{ overflowX: "auto" }}>
              {JSON.stringify(source, null, 2)}
            </pre>
          </Segment>
        </Grid.Column>
      )}
    </Grid>
  );
};
export default AssetShowSearchComponent;
