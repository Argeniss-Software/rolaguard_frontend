import * as React from "react";
import "./tag.component.css"
import { Icon, Label } from "semantic-ui-react";

class Tag extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, color, textColor, id, onClick, removable} = this.props;
        return (
            <div
                className="container"
                style={{backgroundColor: color, fontSize:this.props.fontSize, opacity:this.props.opacity}}
                onClick={onClick}
            >
                <span className="text" style={{color: textColor}}>{name}</span> {removable?<Icon inverted name='delete'/>:""}
        {/*<Label>{name}<Icon name='delete'/></Label>*/}
            </div>
        );
    }
}

export default Tag;
