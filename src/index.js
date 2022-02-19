import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Redirect from './redirect';

import store from './app/store'
import { Provider } from 'react-redux'

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Homepage URL path */}
          <Route exact path="/" element={<App />}/>
          {/* Redirect URL path */}
          <Route exact path="/*" element={<Redirect />}/>
          </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  rootElement,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
