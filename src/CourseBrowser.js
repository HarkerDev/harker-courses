import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import * as firebase from 'firebase';
import coursesDataCO from '../courses.json';

const coursesData = coursesDataCO;

const courseIDS = [];
let currentIDS = [];
let courseCategories = [];
const subjects = [];

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp(`^${escapedValue}`, 'i');

  return subjects
    .map(section => ({
      title: section.title,
      subjects: section.subjects.filter(language => regex.test(language.name)),
    }))
    .filter(section => section.subjects.length > 0);
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.subjects;
}

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
  return (
    <a key={courseID} href={`/#/course/${courseID}`}>
      <li>{ coursesData[courseID].title }</li>
    </a>
  );
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

    const postsRef = firebase.database().ref('harker-courses').child('posts');
    postsRef.on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        console.log(childData);
      });
    });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    console.log(suggestions);
    currentIDS = suggestions.reduce((obj, x) => obj.concat(x.subjects.map(y => y.id)), []);
    this.setState({
      suggestions,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  categoryRender(category) {
    console.log('Filtering for', category);
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
    return (
      <li onClick={() => this.categoryRender(category)} role="presentation" key={category}>{ category }</li>
    );
  }

  renderCategories() {
    return courseCategories.map(this.renderCategory, this);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for a course',
      value,
      onChange: this.onChange,
    };
    return (
      <div>
        <Autosuggest
          multiSection
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          renderSectionTitle={renderSectionTitle}
          getSectionSuggestions={getSectionSuggestions}
          inputProps={inputProps}
        />
        <h3 className="text-center">Browse By Department</h3>
        {!this.categoryClicked ? (<div id="categories">
          <ul>
            { this.renderCategories() }
          </ul>
        </div>) : (<div id="categories">
          <ul><li
            className="back-li"
            role="presentation"
            onClick={() => {
              this.categoryClicked = false; currentIDS = []; this.forceUpdate();
            }}
          >Back To Departments</li></ul>
        </div>)}
        <div id="course-browser">{ this.renderCourses(currentIDS) }</div>
      </div>
    );
  }
}
