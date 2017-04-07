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
                        <li><a href="/#/login">account</a></li>
                        <li><a href="/#/browse">browse</a></li>
                        <li style={{float: "right"}}><Login hide={true}/></li>
                    </ul>
			     </nav>
            </div>
        );
    }
}
