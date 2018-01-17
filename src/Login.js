import React, { Component } from 'react';
import * as firebase from 'firebase';

const Loading = require('react-loading');

let loginInfo;

export default class Login extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.signOut = this.signOut.bind(this);
    this.state_props = {
      loggedIn: undefined,
      name: '',
      photo: '',
      logInInited: false,
    };
    Object.assign(this.state_props, props);

    // Init firebase
    // console.log("Initing firebase again.");
    const config = {
      apiKey: 'AIzaSyDGzHdJ-4B35kuShuJCgmHhkbBy_nMCvy4',
      authDomain: 'harker-courses.firebaseapp.com',
      databaseURL: 'https://harker-courses.firebaseio.com',
      storageBucket: 'harker-courses.appspot.com',
      messagingSenderId: '125151666633',
    };
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }

    // Init sign in
    this.authenticateUser();
  }

  setState(d) {
    Object.keys(d).forEach((k) => {
      if (d[k] !== null) {
        this.state_props[k] = d[k];
      }
    });
    this.forceUpdate();
  }

  authenticateUser() {
    // Install state change handler
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const displayName = user.displayName;
        this.state_props.name = user.displayName;
        const email = user.email;
        const emailVerified = user.emailVerified;
        const photoURL = user.photoURL;
        this.state_props.photo = user.photoURL;
        const uid = user.uid;
        const providerData = user.providerData;
        user.getToken().then((accessToken) => {
          loginInfo = {
            displayName,
            email,
            emailVerified,
            photoURL,
            uid,
            accessToken,
            providerData,
          };
          if (loginInfo.email.indexOf('@students.harker.org') === -1) {
            firebase.auth().signOut().then(() => {
              this.setState({
                loggedIn: false,
              });
              alert('Must log in with students.harker.org email to verify identity as Harker student.');
            }, (err) => {
              console.log(err);
            });
            return;
          }
          let prettyUsername = loginInfo.email.split('@')[0];
          prettyUsername = prettyUsername.slice(0, 3).toUpperCase() + prettyUsername.slice(3, -1)
              + prettyUsername.slice(-1).toUpperCase();
          this.setState({
            loggedIn: true,
            userInfo: loginInfo,
            prettyUsername,
          });
          /*
           document.getElementById('sign-in-status').textContent = 'Signed in';
           document.getElementById('sign-in').textContent = 'Sign out';
           document.getElementById('account-details').textContent = JSON.stringify({
           displayName: displayName,
           email: email,
           emailVerified: emailVerified,
           photoURL: photoURL,
           uid: uid,
           accessToken: accessToken,
           providerData: providerData
           }, null, '  ');
           */
        });
      } else {
        this.setState({
          loggedIn: false,
        });
        /*
         // User is signed out.
         document.getElementById('sign-in-status').textContent = 'Signed out';
         document.getElementById('sign-in').textContent = 'Sign in';
         document.getElementById('account-details').textContent = 'null';
         */
      }
    }, (error) => {
      console.log(error);
    }).bind(this);
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      this.setState({
        loggedIn: false,
      });
    }, (err) => {
      console.log(err);
    });
  }

  htmlGenerator() {
    console.log(this.state_props.loggedIn);
    if (this.state_props.loggedIn === undefined) {
      return (
        <div>
          <Loading type="balls" color="#e3e3e3" />
        </div>
      );
    } else if (this.state_props.loggedIn === false) {
      // <div id="firebaseui-auth-container"></div>
      if (this.state_props.hide) {
        const LoginClass = global.loginClass;
        return <LoginClass />;
      }
    } else if (this.state_props.loggedIn === true) {
      if (!this.state_props.hide) {
        return (
          <div className="well">
            <ul className="media-list">
              <li className="media">
                <div className="media-left">
                  <a href="#"><img src={this.state_props.photo} alt="login button" /></a>
                </div>
                <div className="media-body">
                  <h4 className="media-heading">
                    {this.state_props.name}
                    {/* ({this.state_props.prettyUsername})*/}
                  </h4>
                  <h5>(currently anonymous)</h5>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.signOut}
                  > Sign Out </button>
                </div>
              </li>
            </ul>
          </div>
        );
      }
    }
    return null;
  }

  render() {
    return (
      <div>
        { this.htmlGenerator() }
      </div>
    );
  }
}
