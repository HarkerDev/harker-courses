import React, { Component } from 'react';

export default class NavBar extends Component {
  render() {
    return <nav className="navbar">
      <a href="/" className="mdc-typography--headline4">Harker Courses</a>
      <a href="/about">about</a>
    </nav>
  }
}
