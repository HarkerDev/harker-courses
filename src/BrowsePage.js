import React, { Component } from 'react';

import Login from "./Login";
import CourseBrowser from "./CourseBrowser";

// Review page code
export default class BrowsePage extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
				<Login />
				<CourseBrowser />
			</div>
        );
    }
}
