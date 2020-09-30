import React, { useEffect, useState} from "react";
import _ from "lodash";
import "./packets-graph-component.css";
import { Grid, Label } from "semantic-ui-react";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const RssiRangeFilter = (props) => {
  /*
   * This component show a range rc slider for filtering RSSI
   *
   * @param onAfterChange [Function]: to execute after the range change
   * @param onReset       [Function]: to execute when press the clear filter button
   * @param rssiRange     [Object]:   object with min and max values for range
   * @param rssiFilter    [Object]:   object with from and to values that indicate the filtered range
   */

  let marksRssi = {};
  marksRssi[props.rssiRange.min] = {
    style: {
      color: "black",
      fontSize: "9px",
    },
    label: <strong>{props.rssiRange.min} dBm</strong>,
  };
  marksRssi[props.rssiRange.max] = {
    style: {
      color: "black",
      fontSize: "9px",
    },
    label: <strong>{props.rssiRange.max} dBm</strong>,
  };

  const handleAfterChange = (data) => {
    if (_.isFunction(props.onAfterChange)) {
      props.onAfterChange(data);
    }
  };

  const [rssiValue, setRssiValue] = useState([
    props.rssiFilter.from,
    props.rssiFilter.to,
  ]);

  useEffect(() => {
    setRssiValue([props.rssiFilter.from, props.rssiFilter.to]);
  }, [props.rssiFilter]);

  const resetRange = () => {
    if (_.isFunction(props.onReset)) {
      setRssiValue([props.rssiRange.min, props.rssiRange.max]);
      props.onReset();
    }
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={10}>
          <Range
            defaultValue={[props.rssiRange.min, props.rssiRange.max]}
            allowCross={false}
            min={props.rssiRange.min}
            max={props.rssiRange.max}
            value={rssiValue}
            onChange={(value) => setRssiValue(value)}
            onAfterChange={handleAfterChange}
            pushable={true}
            className="pull-right"
            style={{ marginRight: "15px" }}
            marks={marksRssi}
            trackStyle={[
              {
                backgroundColor: "#008efb",
                borderColor: "#008efb",
              },
            ]}
            handleStyle={[
              {
                borderColor: "#008efb",
              },
              { borderColor: "#008efb" },
            ]}
          ></Range>
        </Grid.Column>
        <Grid.Column width={6}>
          <Label
            as="a"
            onClick={resetRange}
            title="Click to reset filter"
            color="blue"
          >
            RSSI:{" "}
            <strong>
              {props.rssiFilter.from} dBm TO {props.rssiFilter.to} dBm
            </strong>
          </Label>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default RssiRangeFilter;
