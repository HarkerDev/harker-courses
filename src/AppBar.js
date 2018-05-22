import React, { Component } from 'react';
import Login from './Login';
import NavBar from './NavBar';

export default class AppBar extends Component {
    render() {
        return <div className="app-bar">
                    <NavBar />
                    <div className="spacer"></div>
                    <Login  />
                </div>
    }
}
