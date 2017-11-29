import React from 'react';
import Login from './Login';

const Navigation = () => (
  <div>
    <nav className="navbar">
      <ul>
        <li><a href="/#/">harker-courses</a></li>
        <li><a href="/#/about">about</a></li>
        <li style={{ float: 'right' }}><Login hide /></li>
      </ul>
    </nav>
  </div>
);

export default Navigation;
