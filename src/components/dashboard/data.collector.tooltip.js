import * as React from "react";
import { Label, Popup, Grid} from "semantic-ui-react";
import DataCollectorTooltipColumn from "./data.collector.tooltip.column";
import "./data.collector.tooltip.css";

class DataCollectorTooltip extends React.Component {
    render() {
        const { activeCollectors, totalCollectors, dataCollectors } = this.props;
        const enabledCollectors = dataCollectors.filter(d => d.label.color === "green");
        const disabledCollectors = dataCollectors.filter(d => d.label.color === "red");
        // define how many columns exists
        const columnsCount = enabledCollectors.length && disabledCollectors.length ? 2 :
                        enabledCollectors.length || disabledCollectors.length ? 1 :
                        0;
        const label = <Label style={{backgroundColor: (activeCollectors === totalCollectors) ? '#5d9cec' : '#f05050', color: 'white'}}><h3>{activeCollectors}/{totalCollectors}</h3></Label>
        //array of columns to show
        const columns = []
        columns.push(
            // first column may be shows connected or disconnected data collectors
            <DataCollectorTooltipColumn key="data-collesictor-tooltip-column-enabled" 
                    dataCollectors={enabledCollectors.length ? enabledCollectors : disabledCollectors} 
                    active={columnsCount > 1 || enabledCollectors.length }
                    text = {enabledCollectors.length ? "CONNECTED" : "DISCONNECTED"}/>
        )
        if (columnsCount > 1){
            // second column always shows disconnected data collectors
            columns.push(    
                <DataCollectorTooltipColumn key="data-collector-tooltip-column-enabled" 
                    dataCollectors={disabledCollectors} active={false}
                    text="DISCONNECTED"/>
            )
        }
            
        return (
            columnsCount === 0 ? label :
            <Popup trigger={label} flowing hoverable>
                <Grid centered divided padded columns={columnsCount} >
                    {columns}
                </Grid>
            </Popup>
        )
    }
}

export default DataCollectorTooltip;