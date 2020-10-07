import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Button,
  Grid,
  Segment,
  Dropdown,
  Dimmer,
  Loader,
  Checkbox,
} from "semantic-ui-react";
import _ from "lodash";
import { MobXProviderContext } from "mobx-react";
import * as vis from "vis-timeline/standalone";
import moment from "moment";

const TimeLineGraph = (props) => {
  const { globalConfigStore } = useContext(MobXProviderContext);
  const [rangeDates, setRangeDates] = useState({});
  const [firstTime, setFirstTime] = useState(true);
  const fromDate = props.dateTimeRange.from || rangeDates.start;
  const toDate = props.dateTimeRange.to || rangeDates.end;
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
      start: moment().subtract(1, "hours"),
      end: moment().add(5, "minutes"),
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
     */
    },
  } = props;

  const showControlBar = props.showControlBar || false;
  const enableFilterQty = props.enableFilterQty || false;

  const refElement = useRef(null);
  const [items, setItems] = useState({});
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
    if (!_.isEmpty(props.items) && !_.isEmpty(timeline)) {
      setItems(props.items);
      timeline.setItems(props.items);
      if (firstTime) {
        // first time fit automatically
        fit();
        setFirstTime(false);
      }
    }
  }, [props.items]);

  useEffect(() => {
    if (!_.isEmpty(timeline)) {
      timeline.on("select", function(event) {
        triggerClickItemEvent(_.get(event, "items[0]"));
      });
      timeline.on("rangechanged", function(data) {
        if (_.isFunction(props.onRangeChanged)) {
          props.onRangeChanged(data);
        }
      });
      setRangeDates(timeline.getWindow());
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

  const handleChangeShowQty = (event, object) => {
    if (_.isFunction(props.onChangeQty)) {
      props.onChangeQty(object.value);
    }
  };

  const titleGraph = props.titleGraph || "Timeline Title";

  return (
    <React.Fragment>
      <Segment>
        <Grid>
          <Grid.Row style={{ padding: "0px" }}>
            <Grid.Column width={16} className="text-center aligned">
              {titleGraph && <strong>{titleGraph}</strong>}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ padding: "0px" }}>
            <Grid.Column width={4} className="pull-left aligned">
              {showControlBar && (
                <Button.Group basic size="medium">
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
                    icon="resize horizontal"
                    onClick={fit}
                    style={{
                      padding: "5px",
                    }}
                    title="fit all items"
                  ></Button>
                </Button.Group>
              )}
            </Grid.Column>
            <Grid.Column width={8} className="text-center aligned">
              FROM:{" "}
              {moment(fromDate).format(
                globalConfigStore.dateFormats.moment.dateTimeFormat
              )}{" "}
              - TO:{" "}
              {moment(toDate).format(
                globalConfigStore.dateFormats.moment.dateTimeFormat
              )}
            </Grid.Column>
            <Grid.Column width={4} className="pull-right aligned">
              {enableFilterQty && (
                <Dropdown
                  style={{ zIndex: 1001 }}
                  onChange={handleChangeShowQty}
                  options={[
                    { key: 10, text: "Show 10", value: 10 },
                    { key: 20, text: "Show 20", value: 20 },
                    { key: 30, text: "Show 30", value: 30 },
                    { key: 50, text: "Show 50", value: 50 },
                    { key: 70, text: "Show 70", value: 70 },
                    { key: 100, text: "Show 100", value: 100 },
                    { key: 150, text: "Show 150", value: 150 },
                    { key: 200, text: "Show 200", value: 200 },
                    { key: 500, text: "Show 500", value: 500 },
                    { key: 1000, text: "Show 1000", value: 1000 },
                    { key: "all", text: "Show All", value: "all" },
                  ]}
                  compact
                  button
                  item
                  basic
                  defaultValue={20}
                  className="aligned pull-right"
                />
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ padding: "0px" }}>
            <Grid.Column width={16}>
              <Segment>
                <Dimmer
                  active={props.isLoading}
                  inverted
                  style={{ opacity: 0.8 }}
                >
                  <Loader inverted>Loading...</Loader>
                </Dimmer>
                <div ref={refElement}> </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default TimeLineGraph;
