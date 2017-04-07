import React, { Component } from 'react';
import * as firebase from 'firebase';
var Loading = require('react-loading');

var authUi;

export default class Login extends Component {

	constructor(props){
		super(props);
		console.log(props);
		this.state_props = {
			loggedIn: undefined,
			name: "",
			photo: "",
			logInInited: false
		};
		Object.assign(this.state_props, props);

		// Init firebase
        //console.log("Initing firebase again.");
        var config = {
			apiKey: "AIzaSyDGzHdJ-4B35kuShuJCgmHhkbBy_nMCvy4",
			authDomain: "harker-courses.firebaseapp.com",
			databaseURL: "https://harker-courses.firebaseio.com",
			storageBucket: "harker-courses.appspot.com",
			messagingSenderId: "125151666633"
		};
		if(firebase.apps.length === 0){
			firebase.initializeApp(config);
		}

		// Init sign in
		this.authenticateUser();
	}

	setState(d){
		for(var k in d){
			if (d[k] != null) {
				this.state_props[k] = d[k];
			}
		}
		this.forceUpdate();
	}

	authenticateUser() {
		// Install state change handler
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				var displayName = user.displayName;
				this.state_props.name = user.displayName;
	            var email = user.email;
	            var emailVerified = user.emailVerified;
	            var photoURL = user.photoURL;
	            this.state_props.photo = user.photoURL;
	            var uid = user.uid;
	            var providerData = user.providerData;
	            user.getToken().then(function(accessToken) {
					var login_info = {
	  	                displayName: displayName,
	  	                email: email,
	  	                emailVerified: emailVerified,
	  	                photoURL: photoURL,
	  	                uid: uid,
	  	                accessToken: accessToken,
	  	                providerData: providerData
					};
					console.log(JSON.stringify(login_info, null, '  '));
					var pretty_username = login_info.email.split("@")[0];
					pretty_username = pretty_username.slice(0, 3).toUpperCase() + pretty_username.slice(3,-1) + pretty_username.slice(-1).toUpperCase();
					this.setState({
						loggedIn: true,
						userInfo: login_info,
						pretty_username: pretty_username
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
	            }.bind(this));
			} else {
				this.setState({
					loggedIn: false
				});
				/*
				// User is signed out.
				document.getElementById('sign-in-status').textContent = 'Signed out';
				document.getElementById('sign-in').textContent = 'Sign in';
				document.getElementById('account-details').textContent = 'null';
				*/
			}
		}.bind(this), function(error) {
			console.log(error);
		}).bind(this);
	}

	signOut(){
		firebase.auth().signOut().then(() => {
			this.setState({
				loggedIn: false
			});
		}, (err) => {
			console.log(err);
		});
	}

	html_gen() {
		console.log(this.state_props.loggedIn);
		if(this.state_props.loggedIn === undefined){
			return (
				<div>
					<Loading type='balls' color='#e3e3e3' />
				</div>
			);
		} else if(this.state_props.loggedIn === false){
			// <div id="firebaseui-auth-container"></div>
			if(!this.state_props.hide) return;
			var LoginClass = global.loginClass;
			return <LoginClass />;
		} else if(this.state_props.loggedIn === true){
			if(this.state_props.hide) return;
			return (
				<div className="well">
					<ul className="media-list">
						<li className="media">
							<div className="media-left">
								<a href="#"><img src={this.state_props.photo} alt="login button"></img></a>
							</div>
							<div className="media-body">
								<h4 className="media-heading">{this.state_props.name} ({this.state_props.pretty_username})</h4>
								<button type="button" className="btn btn-primary" onClick={this.signOut.bind(this)}>
									Sign Out
								</button>
							</div>
						</li>
					</ul>
				</div>
			);
		}
	}

	render() {
		return (
			<div>
				{ this.html_gen() }
			</div>
		);
	}
}