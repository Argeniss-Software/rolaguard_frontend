import React, { useEffect, useState, useRef } from "react";
import { Button, Grid, Segment, Dropdown } from "semantic-ui-react";
import _ from "lodash";
import * as vis from "vis-timeline/standalone";
import moment from 'moment'

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
      start: moment().subtract(1, 'hours'),
      end: moment().add(5, 'minutes')
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
  const [qtyShow, setQtyShow] = useState(20);

  const triggerClickItemEvent = (itemId) => {
    if (_.isFunction(props.onClickItemEvent)) {
      props.onClickItemEvent({
        id: itemId,
        item: items.find((e) => e.id === itemId),
      });
    }
  };

  useEffect(() => {    
    const dataSetItems = new vis.DataSet(
      (enableFilterQty ? _.take(props.items, qtyShow) : props.items) || defaultItems
    );
    setItems(props.items || defaultItems);
    setTimeLine(
      new vis.Timeline(refElement.current, dataSetItems, groups, options)
    );    
  }, []);  
  
  useEffect(() => {
    if (!_.isEmpty(timeline)) {
      timeline.setItems(_.take(props.items, qtyShow));
      fit()
    }
  }, [qtyShow]);

  useEffect(() => {
    if (!_.isEmpty(timeline)) {
      timeline.on("select", function(event) {
        triggerClickItemEvent(_.get(event, "items[0]"));
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

  const handleChangeShowQty = (event, object) => {
    if (object.value && _.isNumber(object.value)) {
      setQtyShow(object.value);
    } else if (object.value === 'all') {
      setQtyShow(items.length);
    }
  };

  return (
    <React.Fragment>
      <Segment>
        <Grid>
          {showControlBar && (
            <Grid.Column width={16}>
              {enableFilterQty && (
                <Button.Group basic size="tiny" className="aligned pull-left">
                  <Button>
                    <Dropdown
                      onChange={handleChangeShowQty}
                      options={[
                        { key: 10, text: "Show last 10", value: 10 },
                        { key: 20, text: "Show last 20", value: 20 },
                        { key: 30, text: "Show last 30", value: 30 },
                        { key: 50, text: "Show last 50", value: 50 },
                        { key: 70, text: "Show last 70", value: 70 },
                        { key: 100, text: "Show last 100", value: 100 },
                        { key: 150, text: "Show last 150", value: 150 },
                        { key: 200, text: "Show last 200", value: 200 },
                        { key: 500, text: "Show last 500", value: 500 },
                        { key: "all", text: "Show All", value: "all" },
                      ]}
                      compact
                      item
                      basic
                      defaultValue={20}
                    />
                  </Button>
                </Button.Group>
              )}
              <Button.Group basic size="medium" className="aligned pull-right">
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
