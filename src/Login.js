import React, { Component } from 'react';
import * as firebase from 'firebase';

export default class Login extends Component {

	authenticateUser(x) {
		// Init auth
		var config = {
			apiKey: "AIzaSyDGzHdJ-4B35kuShuJCgmHhkbBy_nMCvy4",
			authDomain: "harker-courses.firebaseapp.com",
			databaseURL: "https://harker-courses.firebaseio.com",
			storageBucket: "harker-courses.appspot.com",
			messagingSenderId: "125151666633"
		};
		firebase.initializeApp(config);

		// Install state change handler
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				var displayName = user.displayName;
	            var email = user.email;
	            var emailVerified = user.emailVerified;
	            var photoURL = user.photoURL;
	            var uid = user.uid;
	            var providerData = user.providerData;
	            user.getToken().then(function(accessToken) {
					console.log(JSON.stringify({
  	                displayName: displayName,
  	                email: email,
  	                emailVerified: emailVerified,
  	                photoURL: photoURL,
  	                uid: uid,
  	                accessToken: accessToken,
  	                providerData: providerData
				}, null, '  '));
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
				/*
				// User is signed out.
				document.getElementById('sign-in-status').textContent = 'Signed out';
				document.getElementById('sign-in').textContent = 'Sign in';
				document.getElementById('account-details').textContent = 'null';
				*/
			}
		}, function(error) {
			console.log(error);
		});
	}

	handleSubmit(event) {

	}

	render() {
		this.authenticateUser();
		return (
			<form className='loginForm' onSubmit={this.handleSubmit}>
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
	}
}