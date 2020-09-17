import React, { useEffect, useState, useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import "./alert-timeline-graph.component.css";
import TimeLineGraph from "../../visualizations/timeline-graph.component";
import LoaderComponent from "../loader.component";
import _ from "lodash";
import moment from "moment";
import DetailsAlertModal from "../../details.alert.modal.component";
import {Message} from 'semantic-ui-react'
import * as HttpStatus from "http-status-codes";

const AlertTimeLineGraph = (props) => {
  const { commonStore } = useContext(MobXProviderContext);
  const [alerts, setAlerts] = useState({});
  const [items, setItems] = useState([]);
  const [errorOnRequest, setErrorOnRequest] = useState(false);
  const [perPage, setPerPage] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
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
    Promise.all([alertPromise])
      .then((response) => {
        if (response[0].status === HttpStatus.OK) {
          setAlerts(response[0].data.alerts);
          setItems(getItems(response[0].data.alerts));
          setTotalItems(response[0].data.total_items);
          setTotalPages(response[0].data.total_pages);
          setIsLoading(false);
          setErrorOnRequest(false);
        } else {
          setAlerts([]);
          setItems([]);
          setErrorOnRequest(true);
        }
      })
      .catch(() => {
        setAlerts([]);
        setItems([]);
        setErrorOnRequest(true);
      });
  }, [type, id, perPage, orderBy, dateFilter]);

  const getItems = (data) => {
    return data.map((e, index) => {
      return {
        id: _.get(e, "id", index + 1),
        content: _.truncate(_.get(e, "type.name", "N/A"), { length: 16 }),
        allContent: e,
        start: moment(e.created_at),
        className: _.get(e, "type.risk", "").toLowerCase(),
        group: _.get(e, "type.risk", "").toLowerCase(),
      };
    });
  };

  const closeAlertDetails = () => {
    setSelectedItem({});
  };
  const clickItemEvent = (data) => {
    setSelectedItem({
      alert: _.get(data, "item.allContent", {}),
      alert_type: _.get(data, "item.allContent.type", {}),
    });
  };

  // Configuration for the Timeline
  const options = {
    stack: true,
    maxHeight: 350,
    minHeight: 350,
    editable: false,
    locale: "en",
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
      },
    },
  };

  var groups = [
    {
      id: "info",
      content: "INFO",
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
  ];

  return (
    <React.Fragment>
      {errorOnRequest && (
        <Message
          error
          header="Oops!"
          content={"Something went wrong. Try again later."}
          style={{ maxWidth: "100%" }}
          className="animated fadeIn"
        />
      )}
      {!_.isEmpty(selectedItem) && (
        <DetailsAlertModal alert={selectedItem} onClose={closeAlertDetails} />
      )}
      {_.isEmpty(items) && !errorOnRequest && (
        <LoaderComponent loadingMessage="Loading Alerts Timeline..." />
      )}
      {!_.isEmpty(items) && !errorOnRequest && (
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
