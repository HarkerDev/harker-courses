import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';

import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';

import Home from './Home';
import Login from './Login';
import CoursePage from './CoursePage';


let authUi;

export default class App extends Component {
  constructor(props) {
    super(props);

    // Init login UI
    authUi = new firebaseui.auth.AuthUI(firebase.auth());
    const loginClass = React.createClass({
      componentDidMount() {
        const uiConfig = {
          signInSuccessUrl: '/',
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          ],
          // Terms of service url.
          tosUrl: 'google.com',
        };
        authUi.start('#firebaseui-auth-container', uiConfig);
      },
      componentWillUnmount() {
        authUi.reset();
      },
      render() {
        return (
          <div id="firebaseui-auth-container" />
        );
      },
    });
    global.loginClass = loginClass;
  }
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/course/:courseId" component={CoursePage} />
      </Router>
    );
  }
}

