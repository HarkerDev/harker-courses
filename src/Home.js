import React, { Component } from 'react';
import Login from "./Login";

export default class Home extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <h1>welcome to harker-courses</h1>
                <Login />
            </div>
        );
    }
}
