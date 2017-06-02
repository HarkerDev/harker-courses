import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import * as firebase from 'firebase';
import coursesDataCO from '../courses.json';

var coursesData = coursesDataCO;

var courseIDS = [];
var currentIDS = [];
var courseCategories = [];

var languages = [
    {
        title: '1970s',
        languages: [
            {
                name: 'C',
                year: 1972
            }
        ]
    },
    {
        title: '1980s',
        languages: [
            {
                name: 'C++',
                year: 1983
            },
            {
                name: 'Perl',
                year: 1987
            }
        ]
    },
    {
        title: '1990s',
        languages: [
            {
                name: 'Haskell',
                year: 1990
            },
            {
                name: 'Python',
                year: 1991
            },
            {
                name: 'Java',
                year: 1995
            },
            {
                name: 'Javascript',
                year: 1995
            },
            {
                name: 'PHP',
                year: 1995
            },
            {
                name: 'Ruby',
                year: 1995
            }
        ]
    },
    {
        title: '2000s',
        languages: [
            {
                name: 'C#',
                year: 2000
            },
            {
                name: 'Scala',
                year: 2003
            },
            {
                name: 'Clojure',
                year: 2007
            },
            {
                name: 'Go',
                year: 2009
            }
        ]
    },
    {
        title: '2010s',
        languages: [
            {
                name: 'Elm',
                year: 2012
            }
        ]
    }
];

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return languages
        .map(section => {
            return {
                title: section.title,
                languages: section.languages.filter(language => regex.test(language.name))
            };
        })
        .filter(section => section.languages.length > 0);
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
    return section.languages;
}

// Keep all course ids
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
var prettyCategories = {
    "Science - Life": "Life Sciences",
    "Science - Physical": "Physical Sciences"
}
for(var key in coursesData){
    var on = coursesData[key];
    if(on.subject in prettyCategories){
        on.subject = prettyCategories[on.subject];
    }
}
languages = [];
for(var key in coursesData){
    courseIDS.push(key);
    var on = coursesData[key];
    if(on.subject && on.subject !== "NULL"){
        courseCategories.push(on.subject);
    }
}
courseCategories = uniq(courseCategories);
for(var category of courseCategories){
    languages.push({
        title: category,
        languages: Object.values(coursesData)
            .filter(function(val){
                return val.subject === category;
            })
            .map(function(val){
                return {
                    name: val.title
                };
            })
    })
}

export default class CourseBrowser extends Component {

    constructor(props) {
        super(props);

        this.categoryRender = this.categoryRender.bind(this);

        this.state = {
            value: '',
            suggestions: []
        };

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
        console.log("Filtering for", category);
        currentIDS = [];
        for(var on of courseIDS){
            if(coursesData[on].subject === category){
                currentIDS.push(on);
            }
        }
        this.forceUpdate();
    }

    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Type 'c'",
            value,
            onChange: this.onChange
        };
        return (
            <div>
                <Autosuggest
                    multiSection={true}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    renderSectionTitle={renderSectionTitle}
                    getSectionSuggestions={getSectionSuggestions}
                    inputProps={inputProps} />
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
