import React, { Component } from 'react';

import Login from "./Login";
import ReviewForm from "./ReviewForm";

//Course page
//Will be opened with a parameter carrying the course ID, from which it will
//pull the corresponding reviews from Firebase
export default class CoursePage extends Component {

    constructor(props){
        super(props);
        console.log(props);
        this.courseId = props.routeParams.courseId;
    }

    render() {
        return (
            <div>
				<Login />
				<ReviewForm course={ this.courseId }/>
			</div>
        );
    }
}
