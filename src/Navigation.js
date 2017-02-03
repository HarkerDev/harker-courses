import React, { Component } from 'react';

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
                        <li><a href="/#/review">review</a></li>
                    </ul>
			     </nav>
            </div>
        );
    }
}
