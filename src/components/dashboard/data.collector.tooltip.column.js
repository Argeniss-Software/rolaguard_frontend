import * as React from "react";
import { Header, Grid} from "semantic-ui-react";
import DataCollectorTooltipItem from "./data.collector.tooltip.item";

class DataCollectorTooltipColumn extends React.Component {
    render() {
        const { dataCollectors, active, text } = this.props;
        
        return (
            <Grid.Column>
                <Header as='h4' textAlign="center" className="no-wrap tooltip-header">{text}</Header>
                <DataCollectorTooltipItem key="data-collector-tooltip-item-enabled" 
                    dataCollectors={dataCollectors} active={active}/>
            </Grid.Column> 
        )
    }
}

export default DataCollectorTooltipColumn;