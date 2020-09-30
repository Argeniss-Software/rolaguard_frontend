import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./packets-graph-component.css";
import { Grid, Label } from "semantic-ui-react";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const RangeFilter = (props) => {
  /*
   * This component show a range rc slider for filtering
   *
   * @param onAfterChange [Function]: to execute after the range change
   * @param onReset       [Function]: to execute when press the clear filter button
   * @param range     [Object]:   object with min and max values for range
   * @param filter    [Object]:   object with from and to values that indicate the filtered range
   * @param label    [String]:   label for applied filter values
   * @param unit    [String]:   unit for values
   * @param color    [hex string]: Hexadecimal string for color like: "#008efb"
   */

  let marks = {};
  marks[props.range.min] = {
    style: {
      color: "black",
      fontSize: "9px",
    },
    label: (
      <strong>
        {props.range.min} {props.unit}
      </strong>
    ),
  };

  marks[props.range.max] = {
    style: {
      color: "black",
      fontSize: "9px",
    },
    label: (
      <strong>
        {props.range.max} {props.unit}
      </strong>
    ),
  };

  const handleAfterChange = (data) => {
    if (_.isFunction(props.onAfterChange)) {
      props.onAfterChange(data);
    }
  };

  const [value, setValue] = useState([props.filter.from, props.filter.to]);

  useEffect(() => {
    setValue([props.filter.from, props.filter.to]);
  }, [props.filter]);

  const resetRange = () => {
    if (_.isFunction(props.onReset)) {
      setValue([props.range.min, props.range.max]);
      props.onReset();
    }
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={10}>
          <Range
            defaultValue={[props.range.min, props.range.max]}
            allowCross={false}
            min={props.range.min}
            max={props.range.max}
            value={value}
            onChange={(value) => setValue(value)}
            onAfterChange={handleAfterChange}
            pushable={true}
            className="pull-right"
            style={{ marginRight: "15px" }}
            marks={marks}
            trackStyle={[
              {
                backgroundColor: props.color,
                borderColor: props.color,
              },
            ]}
            handleStyle={[
              {
                borderColor: props.color,
              },
              { borderColor: props.color },
            ]}
          ></Range>
        </Grid.Column>
        <Grid.Column width={6}>
          <Label
            as="a"
            onClick={resetRange}
            title="Click to reset filter"
            style={{ backgroundColor: props.color, color: "white" }}
          >
            {props.label}:{" "}
            <strong>
              {value[0]} {props.unit} TO {value[1]} {props.unit}
            </strong>
          </Label>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default RangeFilter;
