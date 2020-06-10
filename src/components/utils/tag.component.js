import * as React from "react";
import "./tag.component.css"

class Tag extends React.Component {
    render() {
        const { text } = this.props;
        return (
            <div className="container">
                <div className="text">{text}</div>
            </div>
        );
    }
}

export default Tag;
