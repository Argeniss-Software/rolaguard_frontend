import * as React from "react";
import { Icon, List } from "semantic-ui-react";

class DataCollectorTooltipItem extends React.Component {
    render() {
    const { dataCollectors, active } = this.props;
    const color = active ? "green" : "red";
    const itemName = `data-collector-tooltip-item-${active ? "enabled-" : "disabled-"}`;
    
    const tooltipItems = dataCollectors.map((item, index) => {
        return (
            <List.Item key={itemName + index} className="no-wrap">
                <Icon name="circle" color={color} size="tiny" className="tooltip-item-icon"/>
                <List.Content>                    
                    <List.Header className="item-tooltip">{item.text}</List.Header>
                </List.Content>
            </List.Item>
        )
    });

    return (
        <List verticalAlign='middle'>
            {tooltipItems}
        </List>
    )
    }
}

export default DataCollectorTooltipItem;