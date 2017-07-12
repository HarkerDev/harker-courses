import React, { Component } from 'react';

import Login from './Login';
import CourseBrowser from './CourseBrowser';

export default class Home extends Component {

  render() {
    return (
      <div>
        <Login />
        <CourseBrowser />
      </div>
    );
  }
}
