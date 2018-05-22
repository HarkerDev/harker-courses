/* eslint-env browser */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from './courses.json';
import Review, { ReviewScore } from './Review.js';
import ReviewBox from './ReviewBox';

import Snackbar from 'rmwc/Snackbar';

const coursesArr = [];
Object.keys(coursesData).forEach((key) => {
  if (coursesData[key] !== null) {
    coursesArr.push([key, coursesData[key]]);
  }
});

// Form for posting a review
export default class CoursePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state_props = props;
    this.course = props.routeParams.courseId;
    this.reviews = [];
    this.averageStars = 0;
    this.numReviews = 0;
    this.setUpListeners();
  }

  componentWillMount() { }

  setUpListeners() {
    const postRef = firebase.database().ref().child('reviews').child(this.course);
    postRef.on('child_added', (data) => {
      // addCommentElement(postElement, data.key, data.val().text, data.val().author);
      const dataKey = data.key;
      const dataValue = data.val();
      dataValue.key = dataKey;
      this.reviews.push(dataValue);
      this.forceUpdate();
    });
    postRef.on('child_changed', (data) => {
      const dataKey = data.key;
      const dataValue = data.val();
      for (let i = 0; i < this.reviews.length; i += 1) {
        const on = this.reviews[i];
        if (on.key === dataKey) {
          Object.keys(dataValue).forEach((key) => {
            this.reviews[i][key] = dataValue[key];
          });
          break;
        }
      }
      this.forceUpdate();
    });
    postRef.on('child_removed', (data) => {
      const dataKey = data.key;
      let idx = -1;
      for (let i = 0; i < this.reviews.length; i += 1) {
        if (this.reviews[i].key === dataKey) {
          idx = i;
          break;
        }
      }
      this.reviews.splice(idx, 1); // delete review
      this.forceUpdate();
    });
    const courseRef = firebase.database().ref().child('courses').child(this.course);
    courseRef.on('value', (data) => {
      const dataValue = data.val();
      if (!dataValue) {
        this.averageStars = 0;
      } else {
        this.averageStars = dataValue.totalStars / dataValue.totalReviews;
        this.numReviews = dataValue.totalReviews;
      }
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="mdc-card">
            <div className="course">
              <div className="course-info">
                <div className="left">
                  <div className="title mdc-typography--headline6">{coursesData[this.course].title}</div>
                  <div className="description mdc-typography--body2">{coursesData[this.course].prerequisiteString}</div>
                </div>
                <div className="right">
                  <div className="rating">
                    <ReviewScore rating={this.averageStars} />
                    {this.averageStars > 0 && <div className="rating-amount mdc-typography--subtitle2">from {this.numReviews} rating{this.numReviews === 1 ? "" : "s"}</div>}
                  </div>
                </div>
              </div>
              <div className="mdc-card__actions">
                <div className="mdc-card__action-buttons">
                  <button className="mdc-button mdc-card__action mdc-card__action--button" onClick={this.toggleReviewBox.bind(this)}>Write A Review</button>
                </div>
              </div>
            </div>
            <ReviewBox onSubmitted={this.onSubmitted.bind(this)} courseId={this.course} show={this.state && this.state.shouldShowReviewBox} onCloseRequest={this.toggleReviewBox.bind(this)} />
          </div>
        </div>
        <div className="review-container">
          {
            this.reviews.length > 0 && 
            <h1 className="mdc-typography--headline5">Reviews</h1>
          }
          {this.reviews.map(data => <Review key={data.key} review={data} />)}
        </div>
        <Snackbar
          onHide={() => { this.setState({ reviewPosted: false }); }}
          show={this.state.reviewPosted}
          message={this.state.reviewPosted}/>
      </div>
    );
  }

  onSubmitted(success) {
    this.setState({reviewPosted: success ? "Review Posted Successfully" : "Failed to Post Review"});
  }


  toggleReviewBox() {
    this.setState({ shouldShowReviewBox: !(this.state && this.state.shouldShowReviewBox) });
  }
}
