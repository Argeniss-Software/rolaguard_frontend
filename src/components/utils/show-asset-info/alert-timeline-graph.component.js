import React, { useEffect, useState, useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import "./alert-timeline-graph.component.css";
import TimeLineGraph from "../../visualizations/timeline-graph.component";
import _ from "lodash";
import moment from "moment";
import DetailsAlertModal from "../../details.alert.modal.component";
import { Message } from "semantic-ui-react";
import * as HttpStatus from "http-status-codes";
import * as sanitizeHtml from "sanitize-html";

const AlertTimeLineGraph = (props) => {
  const { commonStore, globalConfigStore } = useContext(MobXProviderContext);
  const [items, setItems] = useState([]);
  const [errorOnRequest, setErrorOnRequest] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [orderBy] = useState(["created_at", "DESC"]);
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
        "created_at[gte]": dateFilter.from,
        "created_at[lte]": dateFilter.to,
        page: 1,
        size: perPage,
        order_by: orderBy,
      }
    );
    Promise.all([alertPromise])
      .then((response) => {
        if (response[0].status === HttpStatus.OK) {
          setItems(getItems(response[0].data.alerts));
          setTotalItems(response[0].data.total_items);
          // setTotalPages(response[0].data.total_pages);
          setIsLoading(false);
          setErrorOnRequest(false);
        } else {
          setItems([]);
          setErrorOnRequest(true);
        }
      })
      .catch(() => {
        setItems([]);
        setErrorOnRequest(true);
      });
  }, [type, id, perPage, orderBy, dateFilter]);

  const getItems = (data) => {
    return data.map((e, index) => {
      return {
        id: _.get(e, "id", index + 1),
        content: " ", //_.truncate(_.get(e, "type.name", "N/A"), { length: 14 }),
        allContent: e,
        start: moment(e.created_at),
        // type: "point",
        className: _.get(e, "type.risk", "").toLowerCase(),
        group: _.get(e, "type.risk", "").toLowerCase(),
      };
    });
  };

  const closeAlertDetails = () => {
    setSelectedItem({});
    setSelectedItemId(null);
  };
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    // when click on item, set the item selected for the popup
    if (_.isNumber(selectedItemId)) {
      const selected = items.find((e) => e.id === selectedItemId);
      if (!_.isEmpty(selected)) {
        setSelectedItem({
          alert: _.get(selected, "allContent", {}),
          alert_type: _.get(selected, "allContent.type", {}),
        });
      }
    }
  }, [selectedItemId]);

  const clickItemEvent = (data) => {
    // just set selected item id
    setSelectedItemId(data.id);
  };

  // Configuration for the Timeline
  const options = {
    stack: false,
    maxHeight: 350,
    minHeight: 350,
    editable: false,
    locale: "en",
    zoomMin: 1000 * 60 * 60, // every 5 minutes
    zoomMax: 1000 * 60 * 60 * 24 * 30 * 1, // a month
    clickToUse: true,

    tooltip: {
      template: function(originalItemData, parsedItemData) {
        return `
            <div style="
            border: "1px solid #d4d4d5;
            line-height: "1.4285em";
            max-width: "250px";
            background: "white";
            background-color: "white";
            padding: ".833em 1em";
            font-style: "normal";
            color: "rgba(0,0,0,.87)";
            border-radius: ".28571429rem";
            font-size: "8px"
            ">
            <div>
                <strong>
                <small>${sanitizeHtml(
                  moment(_.get(originalItemData, "start")).format(
                    globalConfigStore.dateFormats.moment.dateTimeFormat
                  ),
                  { allowedTags: [], disallowedTagsMode: "escape" }
                )}</small></strong>
            </div>
                <small>${sanitizeHtml(
                  _.get(originalItemData, "allContent.type.name"),
                  { allowedTags: [], disallowedTagsMode: "escape" }
                )}
                </small>
            </div>`;
      },
    },
  };

  var groups = [
    {
      id: "high",
      content: "HIGH",
    },
    {
      id: "medium",
      content: "MEDIUM",
    },
    {
      id: "low",
      content: "LOW",
    },
    {
      id: "info",
      content: "INFO",
    },
  ];

  const handleRangeChanged = (data) => {
    const { start, end } = data;
    setDateFilter({ from: start, to: end });
  };

  const handleChangeQty = (qty) => {
    if (qty === "all") {
      setPerPage(totalItems);
    } else {
      setPerPage(qty);
    }
  };

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
      {!errorOnRequest && (
        <TimeLineGraph
          showControlBar={true}
          enableFilterQty={true}
          dateTimeRange={dateFilter}
          items={items}
          isLoading={isLoading}
          titleGraph="Alerts Timeline"
          options={options}
          groups={groups}
          onClickItemEvent={clickItemEvent}
          onChangeQty={handleChangeQty}
          onRangeChanged={handleRangeChanged}
        ></TimeLineGraph>
      )}
    </React.Fragment>
  );
};

export default AlertTimeLineGraph;
