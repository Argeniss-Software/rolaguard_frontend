import React, { useEffect, useState, useContext } from "react";
import { Button, Grid, Segment, Popup } from "semantic-ui-react";
import { MobXProviderContext } from "mobx-react";
import "./alert-timeline-graph.component.css";
//import ReactDOM from "react-dom";
import TimeLineGraph from "../../visualizations/timeline-graph.component";
import LoaderComponent from "../loader.component";
import _ from "lodash";
import moment from "moment";
import DetailsAlertModal from "../../details.alert.modal.component"

const AlertTimeLineGraph = (props) => {
  const { commonStore } = useContext(MobXProviderContext);
  const [alerts, setAlerts] = useState({});
  const [items, setItems] = useState([]);
  const [perPage, setPerPage] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState({})
  const [orderBy, setOrderBy] = useState(["created_at", "DESC"]);
  const [dateFilter, setDateFilter] = useState({
    from: null,
    to: null,
  });

  const { type, id } = props;
  
  useEffect(() => {
    setIsLoading(true);
    const alertPromise = commonStore.getData(
      "alerts",
      {
        type: type,
        id: id,
      },

      {
        page: 1,
        size: perPage,
        order_by: orderBy,
        "created_at[gte]": dateFilter.from,
        "created_at[lte]": dateFilter.to,
      }
    );
    Promise.all([alertPromise]).then((response) => {
      setAlerts(response[0].data.alerts);
      setItems(getItems(response[0].data.alerts))
      setTotalItems(response[0].data.total_items);
      setTotalPages(response[0].data.total_pages);
      setIsLoading(false);
    });
  }, [type, id, perPage, orderBy, dateFilter]);

  const getItems = (data) => {
    return data.map((e, index) => {
        return {
          id: _.get(e, "id", index + 1),
          content: _.truncate(_.get(e, "type.name", "N/A"), {length:16}),
          allContent: e,
          start: moment(e.created_at),
          className: _.get(e, "type.risk", "").toLowerCase(),
          group: _.get(e, "type.risk", "").toLowerCase()
        };
    }
    )
  }

  const closeAlertDetails = () => {
      setSelectedItem({})
  }
  const clickItemEvent = (data) => {
    setSelectedItem({ alert: _.get(data, "item.allContent", {}), alert_type: _.get(data, "item.allContent.type", {})})
  }

  // Configuration for the Timeline
  const options = {
    stack: true,
    maxHeight: 350,
    minHeight: 350,
    editable: false,
    locale: "en",
    /*template: function(item, element, data) {
      return ReactDOM.render(
        <Popup
          basic
          trigger={
            <div className="ui error message">{_.get(item, "content", "")}</div>
          }
          content={_.get(item, "content", "")}
        />,
        element
      );
    },*/
    //start: "2016-01-01",
    //end: "2016-01-04",
    tooltip: {
        template: function(originalItemData, parsedItemData) {
          return `
            <div style="
            border: "1px solid #d4d4d5;
            line-height: "1.4285em";
            max-width: "250px";
            background: "#fff";
            padding: ".833em 1em";
            font-style: "normal";
            color: "rgba(0,0,0,.87)";
            border-radius: ".28571429rem";
            box-shadow: "0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15)";
            font-size: "8px"
            ">
            <div>
                <strong>
                <small>${moment(_.get(originalItemData, "start")).format(
                  "MM/DD/YY hh:mm:ss a"
                )}</small></strong>
            </div>
                <small>${_.get(
                  originalItemData,
                  "allContent.type.name"
                )}</small>
            </div>`;
        }
    }
    /*min: new Date(2012, 0, 1), // lower limit of visible range
      max: new Date(2013, 0, 1), // upper limit of visible range
      zoomMin: 1000 * 60 * 60 * 24, // one day in milliseconds
      zoomMax: 1000 * 60 * 60 * 24 * 31 * 3, // about three months in
      */
    /*},*/
  }

  var groups = [
    {
      id: 'info',
      content: "INFO",
      // Optional: a field 'className', 'style', 'order', [properties]
    },
    {
      id: 'low',
      content: "LOW",
      // Optional: a field 'className', 'style', 'order', [properties]
    },
    {
      id: 'medium',
      content: "MEDIUM",
      // Optional: a field 'className', 'style', 'order', [properties]
    },
    {
      id: 'high',
      content: "HIGH",
      // Optional: a field 'className', 'style', 'order', [properties]
    },
    // more groups...
  ];

  return (
    <React.Fragment>
      {_.isEmpty(items) && (
        <LoaderComponent loadingMessage="Loading Alerts..." />
      )}
      {!_.isEmpty(selectedItem) && (
        <DetailsAlertModal
          alert={ selectedItem }
          onClose={closeAlertDetails}
        />
      )}
      {!_.isEmpty(items) && (
        <TimeLineGraph
          showControlBar={true}
          items={items}
          options={options}
          groups={groups}
          onClickItemEvent={clickItemEvent}
        ></TimeLineGraph>
      )}
    </React.Fragment>
  );
};

export default AlertTimeLineGraph;
