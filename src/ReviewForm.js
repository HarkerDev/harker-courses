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

    script.innerHTML = "setTimeout(function() { \
            $('.rating').rating(); \
        }, 200);";

    document.body.appendChild(script);
  }

  handleSubmit(event) {
    event.preventDefault();
    var that = this;
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
          const rating = parseFloat(that.refs.rating.value);
          const review = that.refs.review.value;
          // A review entry.
          const postData = {
            courseId,
            rating,
            review,
            authorId: uid,
            authorName: displayName,
            authorEmail: email,
            authorPhoto: photoURL,
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

          // console.log(firebase.database().ref().update(updates)); // // //
          firebase.database().ref().update(updates).then((data) => {
            // success
            console.log(data);
            that.submitted = 'success';
            that.forceUpdate();
          }, (err) => {
            // error
            console.log('ERROR!');
            that.submitted = 'failure';
            that.forceUpdate();
          });
          // this.props.onReviewSubmit({courseId: courseId, rating: rating, review: review});
          /* that.refs.courseId.value = ''; //reset fields
           that.refs.rating.value = 0;
           that.refs.review.value = '';*/

          // TODO: Check return status, display error/success in field, bootstrap
          // it all, make appropriate input fields, etc.
        });
      }
    });
  }


  render() {
    /*
     <form className='reviewForm' onSubmit={this.handleSubmit.bind(this)}>
     <input type='text' placeholder='Course ID' ref='courseId' />
     <input type='text' placeholder='Rating' ref='rating' />
     <input type='text' placeholder='Review' ref='review' />
     <input type='submit' value='Post' />
     </form>
     */
    if (this.submitted === undefined) {
      return (
        <div>
          <form className="reviewForm" onSubmit={this.handleSubmit}>
            <h3>Post a Review</h3>
            <label htmlFor="courseId">Course:</label>
            <div className="input-group">
              <select className="form-control" ref="courseId" defaultValue={this.course}>
                {coursesArr.map(obj => (
                  <option key={obj[1].title} value={obj[0]}>{ obj[1].title }</option>
                ))}
              </select>
            </div>
            <label htmlFor="rating">Rating:</label>
            <div className="form-group">
              <input
                type="hidden"
                className="rating rating-tooltip-manual"
                data-start="0"
                data-stop="5"
                data-fractions="2"
                ref="rating"
                id="reviewRating"
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                rows="5"
                ref="review"
                placeholder="Your review of this course here"
              />
            </div>
            <div className="form-group">
            	<label htmlFor="anonymousBool">Anonymous:</label>&nbsp;&nbsp;
            	<input type="checkbox" ref="anonymousBool" checked readonly />
            </div>
            <input type="submit" className="btn btn-info" value="Post Review Anonymously!" />
          </form>
        </div>
      );
    } else if (this.submitted === 'success') {
      return (
        <div className="reviewForm alert alert-success">
          <span className="glyphicon glyphicon-ok" />&nbsp;
          <strong>Success!</strong> Posted review.
        </div>
      );
    } else if (this.submitted === 'failure') {
      return (
        <div className="reviewForm alert alert-danger">
          <span className="glyphicon glyphicon-remove" />&nbsp;<strong>
            Error!</strong> Unable to post review.
        </div>
      );
    }
  }
}
