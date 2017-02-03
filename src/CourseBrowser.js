import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

var coursesArr = [];
for(var key in coursesData) {
    if (coursesData[key]!=null) {
        coursesArr.push([key, coursesData[key]]);
    }
}

//form for adding a review
export default class CourseBrowser extends Component {

    constructor(props){
        super(props);

		// TODO: Download all course reviews from database
		var postsRef = firebase.database().ref('harker-courses').child("posts");
		postsRef.on('value', function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var childData = childSnapshot.val();
				console.log(childData);
			});
		})
    }

    render() {
        // TODO: Add search option (maybe to navbar top-right?)
		// For now, lists courses with number of reviews
		// TODO: Add star in ratings next to course name
        return (
			<div>
				<h3 className="text-center">Browse All Courses</h3>
	            <div className="list-group">
					<a className="list-group-item">
						<span className="badge">14</span>
						<h4 className="list-group-item-heading">Course Name</h4>
						<p className="list-group-item-text">Course description here...</p>
					</a>
				</div>
			</div>
        );
    }
}
