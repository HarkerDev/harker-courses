import React, { Component } from 'react';
import * as firebase from 'firebase';

export default class Login extends Component {

	constructor(props){
		super(props);
		this.state = {
			loggedIn: false,
			name: ""
		};

		// Init auth
		var config = {
			apiKey: "AIzaSyDGzHdJ-4B35kuShuJCgmHhkbBy_nMCvy4",
			authDomain: "harker-courses.firebaseapp.com",
			databaseURL: "https://harker-courses.firebaseio.com",
			storageBucket: "harker-courses.appspot.com",
			messagingSenderId: "125151666633"
		};
		firebase.initializeApp(config);
		this.authenticateUser();
	}

	setState(d){
		for(var k = 0; k<d.length; k++){
			this.state[k] = d[k];
		}
		this.forceUpdate();
	}

	authenticateUser() {
		// Install state change handler
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				var displayName = user.displayName;
				this.state.name = user.displayName;
	            var email = user.email;
	            var emailVerified = user.emailVerified;
	            var photoURL = user.photoURL;
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
					this.state.loggedIn = true;
					this.setState({
						loggedIn: true
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
	              }, null, '  ');*/
					
	            }.bind(this));
			} else {
				this.state.loggedIn = true;
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

	html_gen() {
		console.log("logged in state:" + this.state.loggedIn);
		if(!this.state.loggedIn){
			return (
				<form className='loginForm'>
					<h3>Login</h3>
					<label htmlFor="uid">Username:</label>
					<div className="input-group">
					  <input type="text" className="form-control" placeholder="Username" ref='uid' />
					  <span className="input-group-addon" id="basic-addon1">@students.harker.org</span>
					</div>
					<div className="form-group">
					  <label htmlFor="pwd">Password:</label>
					  <input type="password" className="form-control" placeholder="Password" ref='pwd' />
					</div>
					<div id="firebaseui-auth-container"></div>
	        	</form>
			);
		} else {
			return (
				<div>
					hello {this.state.name}
				</div>
			)
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