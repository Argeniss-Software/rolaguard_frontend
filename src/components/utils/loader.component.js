import * as React from "react";

class LoaderComponent extends React.Component {
    render() {
        return (
            <div className="loader-container">
                <h1 className="animated fadeInDown loading-message">
                    <i className="fas fa-circle-notch"/>
                    { this.props.loadingMessage }
                </h1>
            </div>
        );
    }
}

export default LoaderComponent;
