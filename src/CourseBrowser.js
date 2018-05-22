import React, { Component } from 'react';
import coursesDataCO from './courses.json';
import SearchBar from './SearchBar';
import TextCard from './TextCard';
import NavBar from './NavBar';

const coursesData = coursesDataCO;

const courseIDS = [];
let currentIDS = [];
let courseCategories = [];
const subjects = [];

// Keep all course ids
function uniq(a) {
  return a.sort().filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
}

const prettyCategories = {
  'Science - Life': 'Life Sciences',
  'Science - Physical': 'Physical Sciences',
};


Object.keys(coursesData).forEach((key) => {
  const on = coursesData[key];
  if (on.subject in prettyCategories) {
    on.subject = prettyCategories[on.subject];
  }
  courseIDS.push(key);
  if (on.subject && on.subject !== 'NULL') {
    courseCategories.push(on.subject);
  }
});

courseCategories = uniq(courseCategories);
for (const category of courseCategories) {
  subjects.push({
    title: category,
    subjects: Object.values(coursesData)
      .filter(val => val.subject === category)
      .map(val => ({
        name: val.title,
        id: Object.keys(coursesData).filter(x => coursesData[x].title === val.title)[0],
      })),
  });
}

// render course title on page
function renderCourse(courseID) {
  return <TextCard key={courseID} title={coursesData[courseID].title} onClick={() => window.location.href =`/course/${courseID}`} />;
}

export default class CourseBrowser extends Component {
  constructor(props) {
    super(props);

    this.categoryClicked = false;
    this.categoryRender = this.categoryRender.bind(this);

    this.state = {
      value: '',
      suggestions: [],
    };
/*
    const postsRef = firebase.database().ref('harker-courses').child('posts');
    postsRef.on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        console.log(childData);
      });
    });*/
  }

  categoryRender(category) {
    //console.log('Filtering for', category);
    this.filterCategory =  category;
    currentIDS = [];
    for (const on of courseIDS) {
      if (coursesData[on].subject === category) {
        currentIDS.push(on);
      }
    }
    this.categoryClicked = true;
    this.forceUpdate();
  }

  // render all course titles on page
  renderCourses(courseIDs) {
    return courseIDs.map(renderCourse, this);
  }

  renderCategory(category) {
    return <TextCard key={category} title={category} onClick={() => this.categoryRender(category)}/>
  }

  renderCategories() {
    return courseCategories.map(this.renderCategory, this);
  }

  filterResults(query){
    // init courses array
    if (!this.coursesArray){
      var keys = Object.keys(coursesData);
      var vals = Object.values(coursesData);
      this.coursesArray = vals.map((x, index) => { return {id: keys[index], course: x}});
    }
    if (query.length < 3){
      this.currentIDS = [];
      this.categoryClicked = false;
      this.forceUpdate();
      return;
    }

    this.filterCategory = "Search Results";
    currentIDS = this.coursesArray.filter(x => x.course.title.toLowerCase().startsWith(query.toLowerCase())).map(x => x.id);
    this.categoryClicked = true;
    this.forceUpdate();
  }

  componentDidMount(){
    // kind of hacky, I know, but Router won't let me pass state up
    document.querySelector(".app-bar .navbar").style.display = "none";
  }

  componentWillUnmount(){
    document.querySelector(".app-bar .navbar").style.display = "block";
  }

  render() {
    return (
      <div className="course-browser">
        <div className="heading-container">
          <NavBar />
          <SearchBar onQuery={this.filterResults.bind(this)}/>
        </div>
        {!this.categoryClicked ? (
          <div>
            <div className="mdc-typography--headline5 heading">Browse By Department</div>
            <div className="categories">
              { this.renderCategories() }
            </div>
          </div>) : (
            <div>
            <div className="mdc-typography--headline5 heading">
              <i className="material-icons" onClick={() => {this.categoryClicked = false; currentIDS = []; this.forceUpdate();}}>arrow_back</i>
              {this.filterCategory}
            </div>
            <div className="categories">
              { this.renderCourses(currentIDS) }
            </div>
            </div>)}
      </div>
    );
  }
}
