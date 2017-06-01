import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

var courseIDS = [];
var currentIDS = [];
var courseCategories = [];

// Keep all course ids
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
for (var key in coursesData) {
    if (coursesData[key]!=null) {
        courseIDS.push(key);
    }
}
for(var key in coursesData){
    if(coursesData[key].subject && coursesData[key].subject !== "NULL"){
        courseCategories.push(coursesData[key].subject);
    }
}
courseCategories = uniq(courseCategories);

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

    renderCategory(category){
        return (
            <li onClick={() => this.categoryRender(category)} key={category}>{category}</li>
        );
    }

    //render all course titles on page
    renderCourses(courseIDS) {
        return courseIDS.map(this.renderCourse, this);
    };

    renderCategories(categories){
        return courseCategories.map(this.renderCategory, this);
    };

    categoryRender(category) {
        console.log(category);
        switch(category) {
            case 1:
                currentIDS = courseIDS.slice(0,6);
                this.forceUpdate();
                break;
            case 2:
                alert("not finished");
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
                alert("Science");
                break;
            case 11:
                alert("Speech and Debate");
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
                        { this.renderCategories(courseCategories) }
                    </ul>
                </div>
                <div id="course-browser">{ this.renderCourses(currentIDS) }</div>
            </div>
        );
    }
}
