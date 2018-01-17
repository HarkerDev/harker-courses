/* eslint-env browser */
import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

const coursesArr = [];
Object.keys(coursesData).forEach((key) => {
  if (coursesData[key] !== null) {
    coursesArr.push([key, coursesData[key]]);
  }
});

// form for adding a review
export default class CourseInfo extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state_props = props;
    this.course = this.state_props.course;
    this.reviews = [];
    this.averageStars = 0;
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
      // const dataKey = data.key;
      const dataValue = data.val();
      that.reviews.push(dataValue);
      that.forceUpdate();
    });
    postRef.on('child_changed', (data) => {
      const dataKey = data.key;
      const dataValue = data.val();
      for (let i = 0; i < that.reviews.length; i += 1) {
        const on = that.reviews[i];
        if (on.key === dataKey) {
          Object.keys(dataValue).forEach((key) => {
            that.reviews[i][key] = dataValue[key];
          });
          break;
        }
      }
      that.forceUpdate();
    });
    postRef.on('child_removed', (data) => {
      const dataKey = data.key;
      let idx = -1;
      for (let i = 0; i < that.reviews.length; i += 1) {
        if (that.reviews[i].key === dataKey) {
          idx = i;
          break;
        }
      }
      that.reviews.splice(idx, 1); // delete review
      that.forceUpdate();
    });
    const courseRef = firebase.database().ref().child('courses').child(this.course);
    courseRef.on('value', (data) => {
      // const dataValue = data.val();
      data = data.val();
      if (!data) {
        that.averageStars = 'No reviews yet for this class — be the first!';
      } else {
        const reviewAverage = data.totalStars / data.totalReviews;
        const starText = reviewAverage.toFixed(1) !== '1.0' ? 'stars' : 'star';
        const reviewText = data.totalReviews === 1 ? 'review' : 'reviews';
        that.averageStars = `Average course rating: ${reviewAverage.toFixed(2)} ${starText} from ${data.totalReviews} ${reviewText}.`;
      }
      that.forceUpdate();
    });
  }

  timeStamp(timestamp) {
    const now = new Date(timestamp);
    const date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()];
    // const suffix = (time[0] < 12) ? 'AM' : 'PM';
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for (let i = 1; i < 3; i += 1) {
      if (time[i] < 10) {
        time[i] = `0${time[i]}`;
      }
    }
    return date.join('/');/* + " at " + time.join(":") + " " + suffix;*/
  }

  render() {
    return (
      <div className="text-center">
        <h1>{coursesData[this.course].title}</h1>
        <h4>{this.averageStars ? this.averageStars : 'Fetching reviews...'}</h4>
        <br />
        {this.reviews.map(data =>
          (<div key={data.key}>
            <h5><em>Anonymous</em> rated the course <b>{data.rating} star{data.rating.toFixed(1) !== '1.0' ? 's' : ''}</b> on {this.timeStamp(data.timestamp)}</h5>
            {data.review && data.review.length > 0 ? (<p className="review-text">{data.review}</p>) : (<p>(empty review body)<br /><br /></p>)}
          </div>),
        )}
      </div>
    );
  }
}
