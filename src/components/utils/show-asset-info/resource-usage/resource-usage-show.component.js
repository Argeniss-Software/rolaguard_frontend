import React from "react";
import { Grid, Segment, } from "semantic-ui-react";
import _ from "lodash";
import "./resource-usage-show.component.css";
import PacketsGraph from "./packets-graph-component";
import ResourceUsageInfo from "./resource-usage-info.component"

/*
* This component show the resource usage (network overview) info and the packets graph (time vs snr/singal stregnth)
* It has sense show this component when the asset is a device
* 
* @params asset Object
*/ 
const ShowResourceUsage = (props) => {
  const normalizedType =
    _.get(props, "asset.type") &&
    !["gateway", "device"].includes(props.asset.type.toLowerCase().trim())
      ? ""
      : props.asset.type.toLowerCase().trim();

  const isDevice = normalizedType === "device";

  return (
    <Grid divided="vertically">
      <Grid.Column width={5}>
        <ResourceUsageInfo asset={props.asset} />
      </Grid.Column>
      <Grid.Column width={11}>
        {isDevice && (
          <Segment>
            <PacketsGraph type={props.asset.type} id={props.asset.id} />
          </Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ShowResourceUsage;
