import React from "react";
import _ from "lodash";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./slider.component.css"

const SliderComponent = (props) => {    
    const marks = {
      0: <strong>0%</strong>,
      10: <strong>10</strong>,
      20: <strong>20</strong>,
      30: <strong>30</strong>,
      40: <strong>40</strong>,
      50: <strong>50</strong>,
      60: <strong>60</strong>,
      70: <strong>70</strong>,
      80: <strong>80</strong>,
      90: <strong>90</strong>,
      100: {
        style: {
          color: "red",
        },
        label: <strong>100%</strong>,
      },
    };
    return (
      <React.Fragment>
        <div style={{ marginLeft: "10px", marginRight: "10px" }}></div>
        <Range
          width={90}
          defaultValue={[0, 100]}
          allowCross={false}
          step={10}
          dots
          min={0}
          max={100}
          onAfterChange={props.onChange}
          pushable={true}
          marks={marks}
        />
      </React.Fragment>
    );
}
export default SliderComponent;