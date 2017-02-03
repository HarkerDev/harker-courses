import React, { Component } from 'react';
import './App.css';
import { Router, Route, hashHistory } from 'react-router'

import Navigation from "./Navigation";
import Home from "./Home";
import Login from "./Login";
import ReviewPage from "./ReviewPage";

export default class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/review' component={ReviewPage} />
      </Router>
    );
  }
}

