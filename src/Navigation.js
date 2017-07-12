import React, { Component } from 'react';
import Login from './Login';

export default class Navigation extends Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li><a href="/#/">harker-courses</a></li>
            <li><a href="/#/login">account</a></li>
            <li style={{ float: 'right' }}><Login hide /></li>
          </ul>
        </nav>
      </div>
    );
  }
}
