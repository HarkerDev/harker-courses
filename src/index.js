/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';

import AppBar from './AppBar'
import App from './App';
import './index.css';

ReactDOM.render(
  <div>
    <AppBar />
    <App />
  </div>,
  document.getElementById('root'),
);
