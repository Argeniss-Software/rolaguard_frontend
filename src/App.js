import React, { Component } from 'react';
import { loadReCaptcha } from 'react-recaptcha-google';

import Router from "./App.router"
import './App.css';
import API from "./util/api.js"

class App extends Component {
    
    componentDidMount() {
      loadReCaptcha();
      API.setAuthInterceptor();
    }

    render() {
        return (
            <Router style={{ height: "100vh" }}/>
        );
    }
}

export default App;
