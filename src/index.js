import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// use HashRouter instead of BrowserRouter to make skynetlabs work: https://docs.skynetlabs.com/developer-guides/skynet-with-react
import { HashRouter, Routes, Route } from 'react-router-dom';
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
      {/* use HashRouter instead of BrowserRouter to make skynetlabs work: https://docs.skynetlabs.com/developer-guides/skynet-with-react */}
      {/* this requires all URL paths to be prefixed with /#/ which isn't ideal, but needed to make skynetlabs work*/}
      {/* Ex. https://gatr.com/#/23 instead of https://gatr.com/23 */}
      {/* <BrowserRouter> */}
      <HashRouter>
        <Routes>
          {/* Homepage URL path */}
          <Route exact path="/" element={<App />}/>
          {/* Redirect URL path */}
          <Route exact path="/:lockID" element={<Redirect />}/>
          </Routes>
      </HashRouter>
      {/* </BrowserRouter> */}
    </Provider>
  </React.StrictMode>,
  rootElement,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
