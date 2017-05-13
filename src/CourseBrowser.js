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

export default class CourseBrowser extends Component {

    constructor(props) {
        super(props);

        this.categoryRender = this.categoryRender.bind(this);

        // TODO: Download all course reviews from database
        var postsRef = firebase.database().ref('harker-courses').child("posts");
        postsRef.on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                console.log(childData);
            });
        })
    };

    //render course title on page
    renderCourse(courseID) {
        return (
            <a key={ courseID } href={ "/#/course/" + courseID }>
                <li>{ coursesData[courseID].title }</li>
            </a>
        );
    };

    //render all course titles on page
    renderCourses(courseIDS) {
        return courseIDS.map(this.renderCourse);
    };


    categoryRender(num) {

        switch(num) {
            case 1:
                alert("Business and Entrepreneurship");
                break;
            case 2:
                alert("Computer Science");
                break;
            case 3:
                alert("English");
                break;
            case 4:
                alert("Global Online Academy");
                break;
            case 5:
                alert("History and Social Science");
                break;
            case 6:
                alert("Journalism");
                break;
            case 7:
                alert("Mathematics");
                break;
            case 8:
                alert("Modern and Classical Languages");
                break;
            case 9:
                alert("Physical Education");
                break;
            case 10:
                alert("Speech and Debate");
                break;
            case 11:
                alert("Business and Entrepreneurship");
                break;
            case 12:
                alert("Visual and Performing Arts");
                break;
        }

    }

    render() {
        return (
            <div>
                <h3 className="text-center">Browse All Courses</h3>
                <div id="categories">
                    <ul>
                        <li onClick={ () => this.categoryRender(1) }>Business and Entrepreneurship</li>
                        <li onClick={ () => this.categoryRender(2) }>Computer Science</li>
                        <li onClick={ () => this.categoryRender(3) }>English</li>
                        <li onClick={ () => this.categoryRender(4) }>Global Online Academy</li>
                        <li onClick={ () => this.categoryRender(5) }>History and Social Science</li>
                        <li onClick={ () => this.categoryRender(6) }>Journalism</li>
                        <li onClick={ () => this.categoryRender(7) }>Mathematics</li>
                        <li onClick={ () => this.categoryRender(8) }>Modern and Classical Languages</li>
                        <li onClick={ () => this.categoryRender(9) }>Physical Education</li>
                        <li onClick={ () => this.categoryRender(10) }>Science</li>
                        <li onClick={ () => this.categoryRender(11) }>Speech and Debate</li>
                        <li onClick={ () => this.categoryRender(12) }>Visual and Performing Arts</li>
                    </ul>
                </div>
                <div id="course-browser">{ this.renderCourses(courseIDS) }</div>
            </div>
        );
    }
}
