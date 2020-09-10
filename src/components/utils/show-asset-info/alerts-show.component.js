import React, { useState, useContext, useEffect } from "react";
import { MobXProviderContext } from "mobx-react";
import {
  Table,
  Label,
  Grid,
  Pagination,
  Segment,
  Icon,
  Button,
  Popup,
} from "semantic-ui-react";
import Moment from "react-moment";
import _ from "lodash";
import moment from "moment";
import DatePicker from "react-datepicker";
import EmptyComponent from "../../utils/empty.component";
import AlertUtil from "../../../util/alert-util";
import AssetLink from "../../utils/asset-link.component";
import DetailsAlertModal from "../../../components/details.alert.modal.component";
import LoaderComponent from "../loader.component";
import AssetIdComponent from "../asset-id.component";

const ShowAlerts = (props) => {
  const colorsMap = AlertUtil.getColorsMap();
  const { commonStore } = useContext(MobXProviderContext);

  const [selectedAlert, setSelectedAlert] = useState({
    alert: {},
    alert_type: {},
  });

  const [alerts, setAlerts] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [orderBy, setOrderBy] = useState(["created_at", "DESC"]);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [dateFilterTmp, setDateFilterTmp] = useState({
    from: null,
    to: null,
  });
  const [dateFilterRange, setDateFilterRange] = useState('');
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
        page: activePage,
        size: perPage,
        order_by: orderBy,
        "created_at[gte]": dateFilter.from,
        "created_at[lte]": dateFilter.to,
      }
    );
    Promise.all([alertPromise]).then((response) => {
      setAlerts(response[0].data.alerts);
      setTotalItems(response[0].data.total_items);
      setTotalPages(response[0].data.total_pages);
      setIsLoading(false);
    });
  }, [type, id, activePage, perPage, orderBy, dateFilter]);

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  const showAlertDetails = (data) => {
    setSelectedAlert({ alert: data, alert_type: data.type });
  };
  const toggleSort = (field) => {
    setOrderBy([field, orderBy[1] === "ASC" ? "DESC" : "ASC"]);
  };

  const closeAlertDetails = () => {
    setSelectedAlert({ alert: {}, alert_type: {} });
  };

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
  
  const clearDateFilters = () => { // clear filter
    setDateFilterRange("");
    setDateFilterTmp({from: '', to:''});
    setDateFilter({ from: "", to: "" });
  }

  const updateRange = (range) => {
    setDateFilterTmp((dateRange) => {
      return { ...dateRange, ...{ to: new Date() } };
    });
    setDateFilterRange(range)
    let from = moment()
    console.log('moment()', moment())
    console.log("moment().format()", moment().format());
    switch (range) {
      case "DAY":
        from = from.subtract(1, "days")
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
    let to = moment()
        
    
        setDateFilterTmp({
          from: from.format("MMMM D YYYY hh:mm a"),
          to: to.format("MMMM D YYYY hh:mm a")
        });
    
        setDateFilter((actualDateRange) => {
      return {
        ...actualDateRange,
        ...{
          from: from.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z",
          to: to.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
        },
      };
    });
  };

  if (isLoading) {
    return <LoaderComponent loadingMessage="Loading alarms..." />;
  } else {    
      return (
        <React.Fragment>
          <h5
            class="ui inverted top attached header"
            style={{ height: "44px" }}
          >
            ALERTS {totalItems > 0 && <Label color="red">{totalItems}</Label>}
          </h5>

          <Segment attached>
            <Grid flex>
              <Grid.Column width={6}>
                <div
                  style={{
                    display: "inline-flex",
                    width: "100%",
                    paddingLeft: "20px",
                  }}
                >
                  <i
                    className="fas fa-calendar-alt"
                    style={{ marginTop: "7px" }}
                  />
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
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    isClearable={true}
                    dateFormat="MMMM D YYYY hh:mm a"
                  />
                </div>
              </Grid.Column>
              <Grid.Column width={6}>
                <div style={{ display: "inline-flex", width: "100%" }}>
                  <i
                    className="fas fa-calendar-alt"
                    style={{ marginTop: "7px" }}
                  />
                  <DatePicker
                    fluid
                    selectsEnd
                    todayButton="Today"
                    startDate={
                      dateFilterTmp.from ? moment(dateFilterTmp.from) : null
                    }
                    endDate={dateFilterTmp.to ? moment(dateFilterTmp.to) : null}
                    minDate={
                      dateFilterTmp.from ? moment(dateFilterTmp.from) : null
                    }
                    placeholderText="Select a finish date"
                    selected={
                      dateFilterTmp.to ? moment(dateFilterTmp.to) : null
                    }
                    onChange={handleDateFilterToTmp}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    isClearable={true}
                    dateFormat="MMMM D YYYY hh:mm a"
                  />
                </div>
              </Grid.Column>

              <Grid.Column width={4}>
                <Grid style={{ marginTop: "0px" }}>
                  <Grid.Column width={5}>
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

            {totalItems > 0 && (
              <Table
                striped
                selectable
                className="animated fadeIn"
                basic="very"
                compact="very"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell collapsing>RISK</Table.HeaderCell>
                    <Table.HeaderCell>DESCRIPTION</Table.HeaderCell>
                    <Table.HeaderCell
                      collapsing
                      onClick={() => toggleSort("created_at")}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon
                        name={`sort content ${
                          orderBy[1] === "ASC" ? "ascending" : "descending"
                        }`}
                        title={`toggle sort order content ${
                          orderBy[1] === "ASC" ? "descending" : "ascending"
                        }`}
                      />
                      DATE
                    </Table.HeaderCell>
                      <Table.HeaderCell collapsing>{type==='gateway' ? 'DEVICE' : 'GATEWAY'}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {alerts.map((alert, index) => (
                    <Table.Row
                      key={index}
                      style={{ cursor: "pointer" }}
                      positive={alert.resolved_at}
                    >
                      <Table.Cell
                        onClick={() => showAlertDetails(alert)}
                        collapsing
                      >
                        {_.get(alert, "type.risk") && (
                          <Label
                            horizontal
                            style={{
                              backgroundColor: colorsMap[alert.type.risk],
                              color: "white",
                              borderWidth: 1,
                              borderColor: colorsMap[alert.type.risk],
                              width: "100px",
                            }}
                          >
                            {alert.type.risk}
                          </Label>
                        )}
                      </Table.Cell>
                      <Table.Cell onClick={() => showAlertDetails(alert)}>
                        {alert.type.name}
                      </Table.Cell>
                      <Table.Cell
                        singleLine
                        onClick={() => showAlertDetails(alert)}
                      >
                        {
                          <Moment format="YYYY-MM-DD hh:mm a">
                            {alert.created_at}
                          </Moment>
                        }
                      </Table.Cell>

                      {!_.isEmpty(selectedAlert.alert) && (
                        <DetailsAlertModal
                          loading={false}
                          alert={selectedAlert}
                          onClose={closeAlertDetails}
                        />
                      )}
                      <Table.Cell
                        className="upper"
                        style={{ maxWidth: "180px" }}
                        collapsing
                      >
                        <AssetIdComponent
                          id={
                            type === "gateway"
                              ? alert.device_id
                              : alert.gateway_id
                          }
                          type={type === "gateway" ? "device" : "gateway"}
                          hexId={
                            type === "gateway"
                              ? alert.parameters.dev_eui ||
                                alert.parameters.dev_addr
                              : alert.parameters.gateway +
                                (alert.parameters.gw_name
                                  ? `(${alert.parameters.gw_name})`
                                  : "")
                          }
                          showAsLink={true}
                        />
                        
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
            {totalItems <= 0 && (
              <EmptyComponent emptyMessage="There are no alerts to show." />
            )}

            {totalPages > 1 && (
              <Grid className="segment centered">
                <Pagination
                  size="mini"
                  activePage={activePage}
                  const
                  onPageChange={handlePaginationChange}
                  totalPages={totalPages}
                />
              </Grid>
            )}
          </Segment>
        </React.Fragment>
      );
    
  }
};

export default ShowAlerts;
