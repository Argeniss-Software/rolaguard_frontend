import React, { Component } from 'react';
import Router from "./App.router"
import './App.css';
import API from "./util/api.js"

class App extends Component {
    
    componentDidMount() {
      API.setAuthInterceptor();
    }

    render() {
        return (
            <Router style={{ height: "100vh" }}/>
        );
    }
}

export default App;
