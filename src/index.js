import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { unregister } from './registerServiceWorker';
import "mobx-react/batchingForReactDom";
import { Provider } from "mobx-react"
import stores from "./stores"

import './index.css';
import './utils.css';
import './floating-label.css';
import App from './App';

ReactDOM.render((
    <Provider {...stores} >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider> 
  ), document.getElementById('root'));

unregister();