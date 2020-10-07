import React, { useState, useEffect } from "react";
import { Grid, Segment, Icon, Button, Popup } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";

/**
 * This component render a date time picker bar with FROM and DATE fields.
 * also add D,M,W (last day, las month and las week) options filters as buttons
 * for preset automatically the from and date filters.
 *
 * When de user press the filter button, clear button or D,M,W, the component
 * trigger a callback function in order to notify the date change
 *
 * @param props:
 *    onDateFilterChange: function to notify date change. It send and object like: {from: date, to: dates}
 **/

const DateFilterBar = (props) => {
  const dateTimePickerFormat = "MMMM D YYYY hh:mm a";
  const dateTimeApiFormat = "YYYY-MM-DDTHH:mm:ss.SSS";
  const timeFormat = "HH:mm";

  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [dateFilterTmp, setDateFilterTmp] = useState({
    from: null,
    to: null,
  });
  const [dateFilterRange, setDateFilterRange] = useState("");

  useEffect(() => {
    props.onDateFilterChange(dateFilter);
    return () => {};
  }, [dateFilter]);

  const handleDateFilterFromTmp = (date) => {
    // set from date but not filter yet
    setDateFilterTmp((dateRange) => {
      return { ...dateRange, ...{ from: date ? date.toDate() : null } };
    });
  };

  const handleDateFilterToTmp = (date) => {
    // set to date but not filter yet
    setDateFilterTmp((dateRange) => {
      return { ...dateRange, ...{ to: date ? date.toDate() : null } };
    });
  };

  const handleDateFilterClick = () => {
    // applied the filter
    setDateFilter((actualDateRange) => {
      return {
        ...actualDateRange,
        ...{ from: dateFilterTmp.from, to: dateFilterTmp.to },
      };
    });
  };

  const clearDateFilters = () => {
    // clear filter
    setDateFilterRange("");
    setDateFilterTmp({ from: "", to: "" });
    setDateFilter({ from: "", to: "" });
  };

  const updateRange = (range) => {
    setDateFilterTmp((dateRange) => {
      return { ...dateRange, ...{ to: new Date() } };
    });
    setDateFilterRange(range);
    let from = moment();
    switch (range) {
      case "DAY":
        from = from.subtract(1, "days");
        break;
      case "WEEK":
        from = from.subtract(1, "week");
        break;
      case "MONTH":
        from = from.subtract(1, "month");
        break;
      default:
        break;
    }
    let to = moment();

    setDateFilterTmp({
      from: from.format(dateTimePickerFormat),
      to: to.format(dateTimePickerFormat),
    });

    setDateFilter((actualDateRange) => {
      return {
        ...actualDateRange,
        ...{
          from: from.format(dateTimeApiFormat) + "Z",
          to: to.format(dateTimeApiFormat) + "Z",
        },
      };
    });
  };

  return (
    <React.Fragment>
      <Segment
        attached
        style={{ display: props.showFilters ? "block" : "none" }}
      >
        <Grid flex>
          <Grid.Column width={6}>
            <div
              style={{
                display: "inline-flex",
                width: "100%",
                paddingLeft: "20px",
              }}
            >
              <i className="fas fa-calendar-alt" style={{ marginTop: "7px" }} />
              <DatePicker
                selectsStart
                todayButton="Today"
                startDate={
                  dateFilterTmp.from ? moment(dateFilterTmp.from) : null
                }
                endDate={dateFilterTmp.to ? moment(dateFilterTmp.to) : null}
                maxDate={dateFilterTmp.to ? moment(dateFilterTmp.to) : null}
                placeholderText="Select a start date"
                selected={
                  dateFilterTmp.from ? moment(dateFilterTmp.from) : null
                }
                onChange={handleDateFilterFromTmp}
                showTimeSelect
                timeFormat={timeFormat}
                timeIntervals={15}
                isClearable={true}
                dateFormat={dateTimePickerFormat}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <div style={{ display: "inline-flex", width: "100%" }}>
              <i className="fas fa-calendar-alt" style={{ marginTop: "7px" }} />
              <DatePicker
                fluid
                selectsEnd
                todayButton="Today"
                startDate={
                  dateFilterTmp.from ? moment(dateFilterTmp.from) : null
                }
                endDate={dateFilterTmp.to ? moment(dateFilterTmp.to) : null}
                minDate={dateFilterTmp.from ? moment(dateFilterTmp.from) : null}
                placeholderText="Select a finish date"
                selected={dateFilterTmp.to ? moment(dateFilterTmp.to) : null}
                onChange={handleDateFilterToTmp}
                showTimeSelect
                timeFormat={timeFormat}
                timeIntervals={15}
                isClearable={true}
                dateFormat={dateTimePickerFormat}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <Grid style={{ marginTop: "-2px", marginLeft: "2px" }}>
              <Grid.Column width={5}>
                <Button.Group basic size="mini">
                  <Popup
                    basic
                    size="mini"
                    trigger={
                      <Button
                        size="mini"
                        compact
                        title="Filter by selected dates"
                        onClick={handleDateFilterClick}
                        icon
                      >
                        <Icon name="filter" />
                      </Button>
                    }
                    content="Apply Filter"
                  />
                  <Popup
                    basic
                    size="mini"
                    trigger={
                      <Button
                        size="mini"
                        compact
                        title="Clear filters"
                        onClick={clearDateFilters}
                        icon
                      >
                        <Icon name="trash" color="red" />
                      </Button>
                    }
                    content="Clear date filters"
                  />
                </Button.Group>
              </Grid.Column>
              <Grid.Column width={11} className="centered aligned">
                <Button.Group basic size="mini">
                  <Popup
                    basic
                    size="mini"
                    trigger={
                      <Button
                        compact
                        size="tiny"
                        active={dateFilterRange === "MONTH"}
                        onClick={() => {
                          updateRange("MONTH");
                        }}
                      >
                        M
                      </Button>
                    }
                    content="Filter by last month"
                  />
                  <Popup
                    basic
                    size="mini"
                    trigger={
                      <Button
                        compact
                        size="tiny"
                        active={dateFilterRange === "WEEK"}
                        onClick={() => {
                          updateRange("WEEK");
                        }}
                      >
                        W
                      </Button>
                    }
                    content="Filter by last week"
                  />

                  <Popup
                    basic
                    size="mini"
                    trigger={
                      <Button
                        compact
                        size="tiny"
                        active={dateFilterRange === "DAY"}
                        onClick={() => {
                          updateRange("DAY");
                        }}
                      >
                        D
                      </Button>
                    }
                    content="Filter by last day"
                  />
                </Button.Group>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default DateFilterBar;
