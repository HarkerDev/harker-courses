import React, { Component } from 'react';
import './App.css';
import { Router, Route, hashHistory } from 'react-router'

import ReviewForm from "./ReviewForm";
import Login from "./Login";

const Home = () => <div><h1>welcome to harker courses</h1><a href="/#/login">login</a></div>

export default class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/review' component={ReviewForm} />
      </Router>
    );
  }
}

