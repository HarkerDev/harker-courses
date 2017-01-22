import React, { Component } from 'react';
import './App.css';

import ReviewForm from "./ReviewForm";


class App extends Component {
  render() {
    return (
    <div className="App">
        <div className="App-header">
          <h2>harker-courses</h2>
        </div>
        <p className="App-intro">
          list of courses
        </p>
        <ReviewForm />
      </div>
    );
  }
}

export default App;
