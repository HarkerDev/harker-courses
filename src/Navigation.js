import React, { Component } from 'react';
import Login from './Login';

const Navigation = () => {
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
};

export default Navigation;
