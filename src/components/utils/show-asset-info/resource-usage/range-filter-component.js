import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./packets-graph-component.css";
import { Grid, Label, Popup } from "semantic-ui-react";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const RangeFilter = (props) => {
  /*
   * This component show a range rc slider for filtering
   *
   * @param onAfterChange [Function]: to execute after the range change
   * @param onClickLabel  [Function]: to execute when press the filter text button
   * @param range     [Object]:   object with min and max values for range
   * @param filter    [Object]:   object with from and to values that indicate the filtered range
   * @param label    [String]:   label for applied filter values
   * @param unit    [String]:   unit for values
   * @param color    [hex string]: Hexadecimal string for color like: "#008efb"
   */

  let marks = {};
  marks[_.floor(props.range.min)] = {
    style: {
      color: "black",
      fontSize: "9px",
    },
    label: (
      <strong>
        {_.floor(props.range.min)} {props.unit}
      </strong>
    ),
  };

  marks[_.ceil(props.range.max)] = {
    style: {
      color: "black",
      fontSize: "9px",
    },
    label: (
      <strong>
        {_.ceil(props.range.max)} {props.unit}
      </strong>
    ),
  };

  const handleAfterChange = (data) => {
    if (_.isFunction(props.onAfterChange)) {
      props.onAfterChange(data);
    }
  };

  const [value, setValue] = useState([props.filter.from, props.filter.to]);
  const [activeLabelStatus, setActiveLabelStatus] = useState(true);

  useEffect(() => {
    setValue([props.filter.from, props.filter.to]);
  }, [props.filter]);

  const clickLabel = () => {
    if (_.isFunction(props.onClickLabel)) {
      setActiveLabelStatus((actualStatus) => {
        return !actualStatus;
      });
      props.onClickLabel();
    }
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={10}>
          <Range
            defaultValue={[_.floor(props.range.min), _.ceil(props.range.max)]}
            allowCross={false}
            min={_.floor(props.range.min)}
            max={_.ceil(props.range.max)}
            value={value}
            onChange={(value) => setValue(value)}
            onAfterChange={handleAfterChange}
            pushable={true}
            className="pull-right"
            step={1}
            style={{ marginRight: "15px" }}
            marks={marks}
            trackStyle={[
              {
                backgroundColor: props.color,
                borderColor: props.color,
                opacity: activeLabelStatus ? 1 : 0.2,
              },
            ]}
            handleStyle={[
              {
                borderColor: props.color,
                opacity: activeLabelStatus ? 1 : 0.2,
              },
              {
                borderColor: props.color,
                opacity: activeLabelStatus ? 1 : 0.2,
              },
            ]}
          ></Range>
        </Grid.Column>
        <Grid.Column width={6} style={{zIndex: 2}}>
          <Popup
            trigger={
              <Label
                as="a"
                onClick={clickLabel}
                style={{
                  backgroundColor: props.color,
                  color: "white",
                  opacity: activeLabelStatus ? 1 : 0.2,
                }}
              >
                {props.label}:{" "}
                <strong>
                  {value[0]} {props.unit} TO {value[1]} {props.unit}
                </strong>
              </Label>
            }
            size="small"
            content={`Click to ${activeLabelStatus ? "hide" : "show"}`}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default RangeFilter;
