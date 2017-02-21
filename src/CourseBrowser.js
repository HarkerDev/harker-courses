import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

for (var key in coursesData) {
  if (coursesData[key]!=null) {
    console.log("coursesData[key].title is " + coursesData[key].title);
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

    //render course names
    for (var key in coursesData) {
      var course = document.createElement("LI");
      var title = document.createTextNode(coursesData[key].title);
      course.appendChild(title);
      document.body.appendChild(course);
    }
  };

  // TODO: Add search option (maybe to navbar top-right?)
  // For now, lists courses with number of reviews
  // TODO: Add star in ratings next to course name
  // <div className="list-group">
  // <a className="list-group-item">
  // <h4 className="list-group-item-heading">Course Name</h4>
  // <p className="list-group-item-text">Course description here...</p></a></div>
  render() {
    return (
      <div>
      <h3 className="text-center">Browse All Courses</h3>
      </div>
    );
  }
}
