import React, { useEffect, useState, useRef } from "react";
import { Button, Grid, Segment, Popup } from "semantic-ui-react";
import { MobXProviderContext } from "mobx-react";
import moment from "moment";
import _ from "lodash";
import * as vis from "vis-timeline/standalone";
import ReactDOM from "react-dom";

const TimeLineGraph = (props) => {
  const defaultItems = [
    {
      id: 1,
      content: "item 1",
      start: "2014-04-20",
      title: "this is the title",
      className: "info",
      group: "info",
    },
    {
      id: 2,
      content: "item 2",
      start: "2014-04-14",
      title: "this is the title",
      className: "low",
      group: "low",
    },
  ];

  const {
    groups = [
      // Configuration for the Timeline
      {
        id: "info",
        content: "INFO",
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: "low",
        content: "LOW",
      },
      {
        id: "medium",
        content: "MEDIUM",
      },
      {
        id: "high",
        content: "HIGH",
      },
    ],
    options = {
      stack: true,
      maxHeight: 250,
      minHeight: 250,
      editable: false,
      locale: "en",
      /*template: function(item, element, data) { // there is a bug on template render: https://github.com/almende/vis/issues/3592
        return ReactDOM.render(
          <Popup
            basic
            trigger={
              <div className="ui error message">
                {_.get(item, "content", "")}
              </div>
            }
            content={_.get(item, "content", "")}
          />,
          element
        );
      },
      //template: template, => handle bar template
      //start: "2016-01-01",
      //end: "2016-01-04",
      /*tooltip: {
                  template: function(originalItemData, parsedItemData) {
                    var color = originalItemData.title == "IN_PROGRESS" ? "red" : "green";
                    return `<span style="color:${color}">${originalItemData.title}</span>`;
                  },*/
      /*min: new Date(2012, 0, 1), // lower limit of visible range
                max: new Date(2013, 0, 1), // upper limit of visible range
                zoomMin: 1000 * 60 * 60 * 24, // one day in milliseconds
                zoomMax: 1000 * 60 * 60 * 24 * 31 * 3, // about three months in
                */
    },
  } = props;

  const showControlBar = props.showControlBar || false;
  const refElement = useRef(null);
  const [items, setItems] = useState({})
  const [timeline, setTimeLine] = useState({});
  
  const triggerClickItemEvent = (itemId) => {
    if (_.isFunction(props.onClickItemEvent)) {
      props.onClickItemEvent({
        id: itemId,
        item: items.find((e) => e.id === itemId),
      });
    }
  };

  useEffect(() => {
    const dataSetItems = new vis.DataSet(props.items || defaultItems);
    setItems(props.items || defaultItems);
    setTimeLine(
      new vis.Timeline(refElement.current, dataSetItems, groups, options)
    );
  }, []);

    useEffect(() => {
      if (!_.isEmpty(timeline)) {
        timeline.on("select", function(event) {
          triggerClickItemEvent(_.get(event, "items[0]"))
        });
      }
    }, [timeline]);

  const fit = () => {
    timeline.fit();
 };

  const zoomOut = () => {
    timeline.zoomOut(1);
  };
  
  const zoomIn = () => {
    timeline.zoomIn(1);
  };
  /*
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
      */
  /*function setHoveredItem(id) {
        var hoveredItem = document.getElementById("hoveredItem");
        hoveredItem.innerHTML = "hoveredItem=" + id;
      }*/
  return (
    <React.Fragment>
      <Segment>
        <Grid>
          {showControlBar && (
            <Grid.Column width={16}>
              <Button.Group basic size="tiny" className="aligned pull-right">
                <Button
                  icon="zoom in"
                  onClick={zoomIn}
                  style={{
                    padding: "5px",
                  }}
                  title="zoom in"
                ></Button>
                <Button
                  icon="zoom out"
                  onClick={zoomOut}
                  style={{
                    padding: "5px",
                  }}
                  title="zoom out"
                ></Button>
                <Button
                  icon="home"
                  onClick={fit}
                  style={{
                    padding: "5px",
                  }}
                  title="fit all items"
                ></Button>
              </Button.Group>
            </Grid.Column>
          )}
          <Grid.Column width={16}>
            <div ref={refElement}> </div>
          </Grid.Column>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default TimeLineGraph;
