import React, {
    useEffect,
    useState,
    useRef
} from "react";
import {Button, Grid, Segment, Popup} from 'semantic-ui-react'
import {
    MobXProviderContext
} from "mobx-react";
import moment from 'moment'
import _ from "lodash";
import * as vis from "vis-timeline/standalone";
import "./alert-timeline-graph.component.css"
import ReactDOM from 'react-dom'

const AlertTimeLineGraph = (props) => {
    
    const items = new vis.DataSet([
      {
        id: 1,
        content: "item 1",
        start: "2014-04-20",
        title: "this is the title",
        className: "red",
        group: "info",
        group: 1,
        title: "this is the title",
      },
      {
        id: 2,
        content: "item 2",
        start: "2014-04-14",
        title: "this is the title",
        group: 2,
      },
      {
        id: 3,
        content: "item 3",
        start: "2014-04-18",
        title: "this is the title",
        group: 2
      },
      {
        id: 4,
        content: "item 4",
        start: "2014-04-16",
        title: "this is the title",
        group_id: 2
      },
      {
        id: 5,
        content: "item 5",
        start: "2014-04-25",
        title: "this is the title",
        group: 1
      },
      {
        id: 6,
        content: "item 6",
        start: "2014-04-27",
        type: "point",
        title: "this is the title",
        group: 3
      },
    ]);
  
    // Configuration for the Timeline
    const options = {
      stack: true,
      maxHeight: 250,
      minHeight: 250,
      editable: false,
      locale: "en",
      template: function(item, element, data) {
        return ReactDOM.render(
          <Popup basic trigger={
            <b>{item.content}</b>} content={item.content}/>
          ,
          element
        );
      },
      //template: template, => handle bar template
      //start: "2016-01-01",
      //end: "2016-01-04",
      tooltip: {
        template: function(originalItemData, parsedItemData) {
          var color = originalItemData.title == "IN_PROGRESS" ? "red" : "green";
          return `<span style="color:${color}">${originalItemData.title}</span>`;
        },
        /*min: new Date(2012, 0, 1), // lower limit of visible range
      max: new Date(2013, 0, 1), // upper limit of visible range
      zoomMin: 1000 * 60 * 60 * 24, // one day in milliseconds
      zoomMax: 1000 * 60 * 60 * 24 * 31 * 3, // about three months in
      */
      },
    };
    var timeline = null
    

    var groups = [
      {
        id: 1,
        content: "info",
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 2,
        content: "low",
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 3,
        content: "medium",
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 4,
        content: "critic",
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      // more groups...
    ];

    useEffect(() => {
                // create timeline:
                timeline = new vis.Timeline(refElement.current, items, groups, options);
               
/*                items.on("*", function(event, properties) {
                  logEvent(event, properties);
                });
                timeline.on("rangechange", function(properties) {
                  logEvent("rangechange", properties);
                });

                timeline.on("rangechanged", function(properties) {
                  logEvent("rangechanged", properties);
                });

                timeline.on("select", function(properties) {
                  logEvent("select", properties);
                });

                timeline.on("itemover", function(properties) {
                  logEvent("itemover", properties);
                  setHoveredItem(properties.item);
                });

                timeline.on("itemout", function(properties) {
                  logEvent("itemout", properties);
                  setHoveredItem("none");
                });

                timeline.on("click", function(properties) {
                  logEvent("click", properties);
                });

                timeline.on("doubleClick", function(properties) {
                  logEvent("doubleClick", properties);
                });

                timeline.on("contextmenu", function(properties) {
                  logEvent("contextmenu", properties);
                });

                timeline.on("mouseDown", function(properties) {
                  logEvent("mouseDown", properties);
                });

                timeline.on("mouseUp", function(properties) {
                  logEvent("mouseUp", properties);
                });
*/
                // other possible events:

                // timeline.on('mouseOver', function (properties) {
                //   logEvent('mouseOver', properties);
                // });

                // timeline.on("mouseMove", function(properties) {
                //   logEvent('mouseMove', properties);
                // });
              }, [])

    const refElement = useRef(null);
    const fit = () => {
        timeline.fit()
    }
    const zoomOut = () => {
        timeline.zoomOut(0.2)
    }
    const zoomIn = () => {
        timeline.zoomIn(0.2);
    }
    const moveLeft = () => {
      timeline.moveTo(-0.2);
    };
    const moveRight = () => {
      timeline.move(0.2);
    };

function stringifyObject(object) {
  if (!object) return;
  var replacer = function (key, value) {
    if (value && value.tagName) {
      return "DOM Element";
    } else {
      return value;
    }
  };
  return JSON.stringify(object, replacer);
}

function logEvent(event, properties) {
  var log = document.getElementById("log");
  var msg = document.createElement("div");
  msg.innerHTML =
    "event=" +
    JSON.stringify(event) +
    ", " +
    "properties=" +
    stringifyObject(properties);
  log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
}

function setHoveredItem(id) {
  var hoveredItem = document.getElementById("hoveredItem");
  hoveredItem.innerHTML = "hoveredItem=" + id;
}
    return (
      <React.Fragment>
        <Segment>
          <Grid>
              <Grid.Column width={16}>
                <Button.Group basic size="tiny" className="aligned pull-right">
                  <Button
                    icon="zoom in"
                    onClick={zoomIn}
                    style={{padding: "5px"}}
                    title="zoom in"
                  ></Button>
                  <Button
                    icon="zoom out"
                    onClick={zoomOut}
                    style={{padding: "5px"}}
                    title="zoom out"
                  ></Button>
                  <Button
                    icon="caret left"
                    onClick={moveLeft}
                    style={{padding: "5px"}}
                    title="move left"
                  ></Button>
                  <Button
                    icon="caret right"
                    onClick={moveRight}
                    style={{padding: "5px"}}
                    title="move right"
                  ></Button>
                  <Button
                    icon="expand"
                    onClick={fit}
                    style={{padding: "5px"}}
                    title="fit all items"
                  ></Button>
                </Button.Group>
              </Grid.Column>
              <Grid.Column width={16}>
                <div ref={refElement}></div>
              </Grid.Column>
          </Grid>
        </Segment>
      </React.Fragment>
    );
};

export default AlertTimeLineGraph;