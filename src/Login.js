/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import Snackbar from 'rmwc/Snackbar';
let loginInfo;

export default class Login extends Component {
  constructor(props) {
    super(props);
    //console.log(props);
    this.signOut = this.signOut.bind(this);
    this.state_props = {
      loggedIn: undefined,
      name: '',
      photo: '',
      logInInited: false,
    };
    Object.assign(this.state_props, props);

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
        const { displayName } = user;
        this.state_props.name = user.displayName;
        const { email } = user;
        const { emailVerified } = user;
        const { photoURL } = user;
        this.state_props.photo = user.photoURL;
        const { uid } = user;
        const { providerData } = user;
        user.getToken().then((accessToken) => {
          loginInfo = {
            displayName, email, emailVerified, photoURL, uid, accessToken, providerData,
          };
          if (loginInfo.email.indexOf('@students.harker.org') === -1) {
            this.setState({loginFailure: true});
            firebase.auth().signOut().then(() => {
              this.setState({
                loggedIn: false,
              });
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
        });
      } else {
        this.setState({
          loggedIn: false,
        });
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
    if (this.state_props.loggedIn === undefined) {
      return null;
    } else if (this.state_props.loginFailure === true){
      return <Snackbar show onHide={() => this.setState({loginFailure: false})} message="You must login with a Harker student account."/>;
    }
    else if (this.state_props.loggedIn === false) {
      // <div id="firebaseui-auth-container"></div>
        const LoginClass = global.loginClass;
        return <LoginClass />;
    } else if (this.state_props.loggedIn === true) {
      if (!this.state_props.hide) {
        return (
          <div className="user">
              <img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg" alt="login button" />
              <span>John Lynch</span>
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
