import React, { Component } from 'react';
import Login from "./Login";

export default class Navigation extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <nav>
                    <ul>
                        <li><a href="/#/">harker-courses</a></li>
                        <li><a href="/#/login">login</a></li>
                        <li><a href="/#/browse">browse</a></li>
                        <li style={{align: "right"}}><Login /></li>
                    </ul>
			     </nav>
            </div>
        );
    }
}
