import * as React from "react";

class EmptyComponent extends React.Component {
    render() {
        return (
            <div className="empty-container">
                <h1 className="empty-message">
                    <i className="fas fa-info-circle"/>
                    <br/>
                    { this.props.emptyMessage }
                </h1>
            </div>
        );
    }
}

export default EmptyComponent;
