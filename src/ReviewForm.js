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
export default class ReviewForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state_props = props;
    this.course = this.state_props.course;
    this.submitted = undefined;
  }

  componentWillMount() {
    const script = document.createElement('script');

    script.innerHTML = 'setTimeout(function() { \n' +
            '$(".rating").rating(); \n' +
        '}, 200);';

    document.body.appendChild(script);
  }

  handleSubmit(event) {
    event.preventDefault();
    const that = this;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const displayName = user.displayName;
        const email = user.email;
        const emailVerified = user.emailVerified;
        const photoURL = user.photoURL;
        const uid = user.uid;
        const providerData = user.providerData;
        user.getToken().then((accessToken) => {
          const loginInfo = [
            displayName,
            email,
            emailVerified,
            photoURL,
            uid,
            accessToken,
            providerData,
          ];
          console.log(loginInfo);
          const courseId = that.refs.courseId.value.trim();
          const rating = parseFloat(this.rating.value);
          const review = this.review.value;
          // A review entry.
          const postData = {
            courseId,
            rating,
            review,
            poster_uid: uid,
            timestamp: Date.now(),
          };

          // Update average star rating.
          const courseRef = firebase.database()
            .ref()
            .child('courses')
            .child(courseId);
          courseRef.child('totalStars').transaction((stars) => {
            if (stars) {
              return stars + rating; // otherwise increment
            }
            return (stars || rating); // if undefined, initialize to given rating
          });
          courseRef.child('totalReviews').transaction((reviews) => {
            if (reviews) {
              return reviews + 1; // otherwise increment
            }
            return (reviews || 1); // if undefined, initialize to 1
          });

          // Get a key for a new Post.
          const newPostKey = firebase.database()
            .ref()
            .child('reviews')
            .child(courseId)
            .push().key;

          // Write the new post's data simultaneously in the posts list and the user's post list.
          const updates = {};
          updates[`/reviews/${courseId}/${newPostKey}`] = postData;
          // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

          firebase.database().ref().update(updates).then((data) => {
            // success
            console.log(data);
            that.submitted = 'success';
            that.forceUpdate();
          }, (err) => {
            // error
            console.log('ERROR!', err);
            that.submitted = 'failure';
            that.forceUpdate();
          });
          // this.props.onReviewSubmit({courseId: courseId, rating: rating, review: review});
          /* that.refs.courseId.value = ''; //reset fields
           that.refs.rating.value = 0;
           that.refs.review.value = '';*/

          // TODO: Check return status, display error/success in field, bootstrap
        });
      }
    });
  }

  render() {
    const retArr = [];
    if (this.submitted === 'success') {
      retArr.push((
        <div className="reviewForm alert alert-success">
          <span className="glyphicon glyphicon-ok" />&nbsp;
          <strong>Success!</strong> Posted review.
        </div>
      ));
    } else if (this.submitted === 'failure') {
      retArr.push((
        <div className="reviewForm alert alert-danger">
          <span className="glyphicon glyphicon-remove" />&nbsp;<strong>
            Error!</strong> Unable to post review.
        </div>
      ));
    }
    retArr.push((
      <div>
        <form className="reviewForm" onSubmit={this.handleSubmit}>
          <h3>Post a Review</h3>
          <h4>Rating:</h4>
          <div className="form-group">
            <input
              type="hidden"
              className="rating rating-tooltip-manual"
              data-start="0"
              data-stop="5"
              data-fractions="2"
              ref={(rat) => { this.rating = rat; }}
              id="reviewRating"
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="5"
              ref={(rev) => { this.review = rev; }}
              placeholder="Your review of this course here"
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="anonymousBool">Anonymous:</label>&nbsp;&nbsp; */}
            {/* <input type="checkbox" ref="anonymousBool" checked readOnly /> */}
            <h6>Keep reviews civil, please. Do not abuse your anonymity.</h6>
          </div>
          <input type="submit" className="btn btn-info" value="Post Review Anonymously" />
        </form>
      </div>
    ));
    return (
      <div>
        {retArr}
      </div>
    );
  }
}
