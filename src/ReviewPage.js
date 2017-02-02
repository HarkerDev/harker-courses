import React, { Component } from 'react';

import ReviewForm from "./ReviewForm";
import Login from "./Login";

// Review page code
export default class ReviewPage extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
				<Login />
				<ReviewForm />
			</div>
        );
    }
}
