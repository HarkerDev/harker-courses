import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router'

import Home from "./Home";
import Login from "./Login";
import Navigation from "./Navigation";
import CoursePage from "./CoursePage";
import * as firebase from "firebase";
import * as firebaseui from 'firebaseui';

var authUi;

export default class App extends Component {
    constructor(props){
        super(props);

        // Init login UI
        authUi = new firebaseui.auth.AuthUI(firebase.auth());
        var loginClass = React.createClass({
          componentDidMount: function() {
            var self = this;
            var uiConfig = {
    			signInSuccessUrl: '/',
    			signInOptions: [
    				// Leave the lines as is for the providers you want to offer your users.
    				firebase.auth.GoogleAuthProvider.PROVIDER_ID
    				//firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    				//firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    				//firebase.auth.GithubAuthProvider.PROVIDER_ID,
    				//firebase.auth.EmailAuthProvider.PROVIDER_ID
    			],
    			// Terms of service url.
    			tosUrl: 'google.com'
    		};
            authUi.start('#firebaseui-auth-container', uiConfig);
          },
          componentWillUnmount: function() {
            authUi.reset();
          },
          render: function() {
            return (
              <div id="firebaseui-auth-container"></div>
            );
          }
        });
        global.loginClass = loginClass;
    }
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/course/:courseId' component={CoursePage} />
      </Router>
    );
  }
}

