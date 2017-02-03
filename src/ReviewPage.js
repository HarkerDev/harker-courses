import React, { Component } from 'react';

import Login from "./Login";
import ReviewForm from "./ReviewForm";

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
