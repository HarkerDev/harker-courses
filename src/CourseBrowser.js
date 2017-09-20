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

for (const key in coursesData) {
  const on = coursesData[key];
  if (on.subject in prettyCategories) {
    on.subject = prettyCategories[on.subject];
  }
}

for (const key in coursesData) {
  courseIDS.push(key);
  const on = coursesData[key];
  if (on.subject && on.subject !== 'NULL') {
    courseCategories.push(on.subject);
  }
}
courseCategories = uniq(courseCategories);
for (const category of courseCategories) {
  subjects.push({
    title: category,
    subjects: Object.values(coursesData)
      .filter(val => val.subject === category)
      .map(val => ({
        name: val.title,
      })),
  });
}

export default class CourseBrowser extends Component {
  constructor(props) {
    super(props);

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

  // render course title on page
  renderCourse(courseID) {
    return (
      <a key={courseID} href={`/#/course/${courseID}`}>
        <li>{ coursesData[courseID].title }</li>
      </a>
    );
  }

  renderCategory(category) {
    return (
      <li onClick={() => this.categoryRender(category)} key={category}>{ category }</li>
    );
  }

  // render all course titles on page
  renderCourses(courseIDs) {
    return courseIDs.map(this.renderCourse, this);
  }

  renderCategories() {
    return courseCategories.map(this.renderCategory, this);
  }

  categoryRender(category) {
    console.log('Filtering for', category);
    currentIDS = [];
    for (const on of courseIDS) {
      if (coursesData[on].subject === category) {
        currentIDS.push(on);
      }
    }
    this.forceUpdate();
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

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
        <div id="categories">
          <ul>
            { this.renderCategories() }
          </ul>
        </div>
        <div id="course-browser">{ this.renderCourses(currentIDS) }</div>
      </div>
    );
  }
}
