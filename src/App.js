import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router'

import Navigation from "./Navigation";
import Home from "./Home";
import Login from "./Login";
import CoursePage from "./CoursePage";
import BrowsePage from "./BrowsePage";
import * as firebase from "firebase";

export default class App extends Component {
    constructor(props){
        super(props);

        // Init firebase
        var config = {
			apiKey: "AIzaSyDGzHdJ-4B35kuShuJCgmHhkbBy_nMCvy4",
			authDomain: "harker-courses.firebaseapp.com",
			databaseURL: "https://harker-courses.firebaseio.com",
			storageBucket: "harker-courses.appspot.com",
			messagingSenderId: "125151666633"
		};
		firebase.initializeApp(config);
    }
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/browse' component={BrowsePage} />
        <Route path='/course' component={CoursePage} />
      </Router>
    );
  }
}

