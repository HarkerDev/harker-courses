import React, { Component } from 'react';

export default class Login extends Component {

	handleSubmit(event) {
		
	}

	render() {
		return (
			<form className='loginForm' onSubmit={this.handleSubmit}>
				<input type='text' placeholder='Username' ref='uid' />
        		<input type='text' placeholder='Password' ref='pwd' />
        	</form>
			);
	}
}