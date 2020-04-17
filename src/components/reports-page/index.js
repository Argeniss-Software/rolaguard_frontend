import * as React from "react";
import { observer } from "mobx-react";
import { Button, Icon } from "semantic-ui-react";

import "./index.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import DatePicker from "react-datepicker";
import moment from 'moment';
import 'moment';

@observer
class ReportComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            startDate: moment(new Date(moment(new Date()).get('Y'), moment(new Date()).get('M'), moment(new Date()).get('D'))),
            endDate: moment(new Date(moment(new Date()).get('Y'), moment(new Date()).get('M'), moment(new Date()).get('D'))),
            displayedStartDate: "Select a start date",
            displayedEndDate: "Select a finish date",
            searchData: {
                startDate: null,
                endDate: null
            },
            ...props
        };
    }


    handleStartDate = (date) => {
        var newDate = date.toLocaleString();
        var timeZoneIndex = newDate.indexOf(" GMT");
        this.setState({
            startDate: date, //moment
            displayedStartDate: newDate.substring(0, timeZoneIndex)

        });
        if (this.state.startDate.isAfter(this.state.endDate)) {
            this.setState({
                endDate: date, //moment
                displayedEndDate: newDate.substring(0, timeZoneIndex)
            });
        }
    }

    handleEndDate = (date) => {
        var newDate = date.toLocaleString();
        var timeZoneIndex = newDate.indexOf(" GMT");

        this.setState({
            endDate: date, //moment
            displayedEndDate: newDate.substring(0, timeZoneIndex)

        });
    }

    render() {

        return (
            <div className="app-body-container-view">
                <div className="animated fadeIn animation-view">
                    <div className="view-header">
                        <h1>REPORTS</h1>
                    </div>

                    {/* VIEW BODY */}
                    <div className="view-body">
                        <div className="view-header-actions">

                            <div className="search-box input-box">
                                <i className="fas fa-calendar-alt" />
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={5}
                                    dateFormat="MMMM d, YYYY HH:mm"
                                    timeCaption="time"
                                    maxDate={moment(new Date())}
                                    minTime={moment(new Date('December 24, 2018 00:00:00'))}
                                    maxTime={this.state.startDate === null ?
                                        moment(new Date('December 24, 2018 23:59:59')) :
                                        moment(this.state.startDate).isSame(moment(new Date()), "year") &&
                                            moment(this.state.startDate).isSame(moment(new Date()), "month") &&
                                            moment(this.state.startDate).isSame(moment(new Date()), "day") ?
                                            moment(new Date()) :
                                            moment(new Date('December 24, 2018 23:59:59'))}
                                    placeholderText="Select a start date"
                                    value={this.state.displayedStartDate}
                                />
                            </div>

                            <div className="search-box input-box">
                                <i className="fas fa-calendar-alt" />
                                <DatePicker
                                    selected={this.state.endDate}
                                    onChange={this.handleEndDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={5}
                                    dateFormat="MMMM d, YYYY HH:mm"
                                    timeCaption="time"
                                    placeholderText="Select a finish date"
                                    value={this.state.displayedEndDate}
                                    minDate={this.state.startDate}
                                    maxDate={moment(new Date())}
                                    minTime={this.state.startDate === null ?
                                        moment(new Date('December 24, 2018 00:00:00')) :
                                        moment(this.state.startDate).isSame(moment(this.state.endDate), "year") &&
                                            moment(this.state.startDate).isSame(moment(this.state.endDate), "month") &&
                                            moment(this.state.startDate).isSame(moment(this.state.endDate), "day") ?
                                            moment(this.state.startDate) :
                                            moment(new Date('December 24, 2018 00:00:00'))}
                                    maxTime={
                                        moment(this.state.endDate).isSame(moment(new Date()), "year") &&
                                            moment(this.state.endDate).isSame(moment(new Date()), "month") &&
                                            moment(this.state.endDate).isSame(moment(new Date()), "day") ?
                                            moment(new Date()) :
                                            moment(new Date('December 24, 2018 23:59:59'))}
                                />
                            </div>

                            <div className="search-box input-box">
                                <Button disabled={this.state.displayedStartDate === "Select a start date"
                                    || this.state.displayedEndDate === "Select a finish date"}
                                    onClick={this.setSearchData} icon labelPosition='right'>
                                    Search
                                    <Icon name='search' />
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ReportComponent;
