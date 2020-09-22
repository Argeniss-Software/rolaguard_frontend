import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { Grid, Segment, Loader, Message, Label, Icon } from "semantic-ui-react";
import CirclePack from "../../visualizations/circle-pack/circle-pack.component";
import { MobXProviderContext } from "mobx-react";
import * as HttpStatus from "http-status-codes";
import LoaderComponent from "../loader.component"

const GatewayCirclePackGraph = (props) => {
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOnRequest, setErrorOnRequest] = useState(false);
  const { inventoryAssetsStore } = useContext(MobXProviderContext);
  
  const [selectedLabels, setSelectedLabels] = useState([])
  
  const mapperTags = (item, index) => {
      return {
        code: item.id,
        selected: selectedLabels.map((e) => e.code).includes(item.id),
        label: item.name,
        value: item.count,
        color: item.color,
      };
  };

  const handleItemSelected = (allItems, selected) => {
    setSelectedLabels((prevSelected) => [...prevSelected, selected]);
  }

  const deleteItemSelected = (item) => {    
    setSelectedLabels((prevSelected) =>
      prevSelected.filter((e) => e.code != item.code)
    );
  };
  

  useEffect(() => {
    setIsLoading(true);
    setErrorOnRequest(false)
    
    if (_.isFunction(props.onChangeSelectedLabels)) {
      props.onChangeSelectedLabels(selectedLabels)
    }

    const labelsPromise = inventoryAssetsStore.getTagsCount({
      gateways: [props.gatewayId],
      tags: selectedLabels.map((e) => e.code),
    });

    Promise.all([labelsPromise])
      .then((response) => {
        if (response[0].status === HttpStatus.OK) {                  
          setLabels(response[0].data.map(mapperTags))
          setErrorOnRequest(false);
        } else {
          setLabels([]);
          setErrorOnRequest(true);
        }
      })
      .catch(() => {
        setLabels([]);
        setErrorOnRequest(true);
      });
    setIsLoading(false);
  }, [props.gatewayId, selectedLabels]);

  return (
    <React.Fragment>
      {errorOnRequest && (
        <Message
          error
          header="Oops!"
          content={"Something went wrong. Try again later."}
          style={{ maxWidth: "100%" }}
          className="animated fadeIn"
        />
      )}
      {!errorOnRequest && isLoading && (
        <LoaderComponent loadingMessage="Loading labels..." />
      )}
      {!errorOnRequest && !isLoading && (
        <div className="box-data">
          <h5 className="visualization-title text-center">
            LABELS OF ASSOCIATED DEVICES
          </h5>

          {selectedLabels.length > 0 && (
            <label style={{ fontWeight: "bolder" }}>
              <i>Applied Filters: </i>
            </label>
          )}
          {selectedLabels.map((item, index) => (
            <Label
              as="a"
              key={"tag" + index}
              className="text-uppercase"
              size="tiny"
              onClick={() => {
                deleteItemSelected(item);
              }}
            >
              {item.label}
              <Icon name="delete" />
            </Label>
          ))}

          <Loader active={isLoading === true} />
          {!isLoading && (
            <div style={{ width: "240px", height: "260px" }}>
              <CirclePack
                isLoading={isLoading}
                data={labels}
                type={"byTagsViz"}
                handler={handleItemSelected}
              />
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default GatewayCirclePackGraph;
