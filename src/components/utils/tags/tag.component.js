import * as React from "react";
import "./tag.component.css"

class Tag extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, color, textColor, id, onSelection} = this.props;
        return (
            <div className="container" style={{backgroundColor: color}} onClick={onSelection}>
                <div className="text" style={{color: textColor}}>{name}</div>
            </div>
        );
    }
}

export default Tag;
