import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import createReactClass from 'create-react-class';

import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';

import Home from './Home';
import Login from './Login';
import About from './About';
import CoursePage from './CoursePage';


let authUi;

export default class App extends Component {
  constructor(props) {
    super(props);

    // Init login UI
    authUi = new firebaseui.auth.AuthUI(firebase.auth());
    
    // eslint-disable-next-line
    const loginClass = createReactClass({
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
      <Router history={browserHistory}>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/course/:courseId" component={CoursePage} />
      </Router>
    );
  }
}

