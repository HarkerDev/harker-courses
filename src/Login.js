import React, { Component } from 'react';

export default class Login extends Component {

	handleSubmit(event) {

	}

	render() {
		return (
			<form className='loginForm' onSubmit={this.handleSubmit}>
				<h3>Login</h3>
				<div className="input-group">
				  <input type="text" className="form-control" placeholder="Username" ref='uid' />
				  <span className="input-group-addon" id="basic-addon1">@students.harker.org</span>
				</div>
				<div className="input-group">
				  <input type="password" className="form-control" placeholder="Password" ref='pwd' />
				</div>
        	</form>
			);
	}
}