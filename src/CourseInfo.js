/* eslint-env browser */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

const coursesArr = [];
for (const key in coursesData) {
  if (coursesData[key] !== null) {
    coursesArr.push([key, coursesData[key]]);
  }
}

// form for adding a review
export default class CourseInfo extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state_props = props;
    this.course = this.state_props.course;
    this.reviews = [];
    this.setUpListeners();
  }

  componentWillMount() {
    /*
     const script = document.createElement('script');

     script.innerHTML = "setTimeout(function() { \
     $('.rating').rating(); \
     }, 200);";

     document.body.appendChild(script);
     */
  }

  setUpListeners() {
    const postRef = firebase.database().ref().child('reviews').child(this.course);
    const that = this;
    postRef.on('child_added', (data) => {
      // addCommentElement(postElement, data.key, data.val().text, data.val().author);
      const dataKey = data.key;
      data = data.val();
      data.key = dataKey;
      that.reviews.push(data);
      that.forceUpdate();
    });
    postRef.on('child_changed', (data) => {
      const dataKey = data.key;
      data = data.val();
      for (let i = 0; i < that.reviews.length; i++) {
        const on = that.reviews[i];
        if (on.key === dataKey) {
          for (const key in data) {
            that.reviews[i][key] = data[key];
          }
          break;
        }
      }
      that.forceUpdate();
    });
    postRef.on('child_removed', (data) => {
      const dataKey = data.key;
      let idx = -1;
      for (let i = 0; i < that.reviews.length; i++) {
        if (that.reviews[i].key === dataKey) {
          idx = i;
          break;
        }
      }
      that.reviews.splice(idx, 1); // delete review
      that.forceUpdate();
    });
    // (see https://firebase.google.com/docs/database/web/lists-of-data)
  }

  render() {
    return (
      <div>
        {this.reviews.map(data =>
          (<div key={data.key}>
            <h3>{data.authorName} {data.authorPhoto ?
              (<img src={data.authorPhoto} alt={data.authorName} />) :
              ''}</h3>
            rated the course: {data.rating} star(s) <br />
            and posted:<br />
            <textarea
              className="form-control"
              readOnly
              value={data.review}
            />
          </div>),
        )}
      </div>
    );
  }
}
