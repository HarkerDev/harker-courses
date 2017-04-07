import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

var courseIDS = [];

//keep all course ids
for (var key in coursesData) {
  if (coursesData[key]!=null) {
    courseIDS.push(key);
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
   };

   //render course title on page
   renderCourse(courseID) {
     return <a href="/#/course"><li>{coursesData[courseID].title}</li></a>;
   };

   //render all course titles on page
   renderCourses(courseIDS) {
     return courseIDS.map(this.renderCourse);
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
          <div id="course-browser">{this.renderCourses(courseIDS)}</div>
      </div>
    );
  }
}
