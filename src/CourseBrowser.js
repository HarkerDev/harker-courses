import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

var courseIDS = [];
var currentIDS = [];

const languages = [
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

    //render all course titles on page
    renderCourses(courseIDS) {
        return courseIDS.map(this.renderCourse);
    };


    categoryRender(num) {
        switch(num) {
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
                <div id="course-browser">{ this.renderCourses(currentIDS) }</div>
            </div>
        );
    }
}
