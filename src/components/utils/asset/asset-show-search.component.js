import React, { useState, useContext } from "react";
import { Search, Grid, Header, Segment, Label } from "semantic-ui-react";
import { MobXProviderContext } from "mobx-react";
import ShowDeviceIcon from "../show-device-icon.component";
import ShowDeviceState from "../show-device-state.component";
import AssetIdComponent from "../asset-id.component";
import Highlighter from "react-highlight-words";

const categoryLayoutRenderer = ({ categoryContent, resultsContent }) => {
  return (
    <div class="category">
      {categoryContent}
      <div className="results">
        {resultsContent ? (
          resultsContent
        ) : (
          <div key="content" className="content" style={{ minHeight: "32px" }}>
              <strong style={{verticalAlign: "-webkit-baseline-middle"}}>No results found...</strong>
          </div>
        )}
      </div>
    </div>
  );
};

const categoryRenderer = ({ name }) => {
  return <div class="name">{name}</div>;
};

const handleResultSelect = (e, { result }) => {
    const { id, type } = result;
    const assetType = type ? type : "device";
    const normalizedType = assetType && assetType.toLowerCase().trim();
    if (
      !_.isNull(id) &&
      !_.isUndefined(id) &&
      ["gateway", "device"].includes(normalizedType)
    ) {
      history.go(`/dashboard/assets/${normalizedType}/${id}/view`);
  };
}

const AssetShowSearchComponent = (props) => {
  const { commonStore } = useContext(MobXProviderContext);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");
  const [debug, setDebug] = useState(false);

const resultRenderer = (data) => {
  return (
    <React.Fragment>
      <div key="content" className="content">
        <div className="price">
          <Label color="black">
            {data.data_collector && (
              <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={[value]}
                autoEscape={true}
                textToHighlight={data.data_collector}
              />
            )}
          </Label>
        </div>
        <div className="title">
          <ShowDeviceState state={data.connected} />
          <ShowDeviceIcon type={data.type}></ShowDeviceIcon>&nbsp;
          <AssetIdComponent
            showAsLink={false}
            highlightSearchValue={value}
            type={data.type}
            hexId={data.hex_id}
            id={data.id}
          />
        </div>

        <div>
          <Grid
            columns="equal"
            stretched="true"
            style={{ width: "100%" }}
            celled
          >
            <Grid.Row>
              <Grid.Column>Name:</Grid.Column>
              <Grid.Column width={4}>
                {data.data_collector && (
                  <strong>
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[value]}
                      autoEscape={true}
                      textToHighlight={data.name}
                    />
                  </strong>
                )}
              </Grid.Column>
              <Grid.Column width={2}>App name:</Grid.Column>
              <Grid.Column width={8}>
                {data.app_name && (
                  <strong>
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[value]}
                      autoEscape={true}
                      textToHighlight={data.app_name}
                    />
                  </strong>
                )}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>Join EUI:</Grid.Column>
              <Grid.Column width={4}>
                <strong>{data.join_eui}</strong>
              </Grid.Column>
              <Grid.Column width={2}>Vendor:</Grid.Column>
              <Grid.Column width={8}>
                {data.vendor && (
                  <strong>
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[value]}
                      autoEscape={true}
                      textToHighlight={data.vendor}
                    />
                  </strong>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};

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
