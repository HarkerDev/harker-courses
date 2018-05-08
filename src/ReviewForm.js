/* eslint-env browser */
import swal from 'sweetalert';
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
        const { displayName } = user;
        const { email } = user;
        const { emailVerified } = user;
        const { photoURL } = user;
        const { uid } = user;
        const { providerData } = user;
        user.getToken().then((accessToken) => {
          const loginInfo = [displayName, email, emailVerified, 
            photoURL, uid, accessToken, providerData];
          console.log(loginInfo);
          const courseId = that.refs.courseId.value.trim();
          const rating = parseFloat(that.rating.value);
          const review = that.review.value;
          // A review entry.
          const postData = {
            courseId, rating, review, poster_uid: uid, timestamp: Date.now()
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

          // TODO: Check return status, display error/success in field, bootstrap
        });
      }
    });
  }

  render() {
    const retArr = [];
    const that = this;
    if (this.submitted === 'success') {
      swal({
        title: 'Success!',
        text: 'Posted review.',
        icon: 'success',
      }).then(() => {
        that.submitted = undefined;
      });
    } else if (this.submitted === 'failure') {
      swal({
        title: 'Error!',
        text: 'Unable to post review.',
        icon: 'error',
      }).then(() => {
        that.submitted = undefined;
      });
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
            <input type="hidden" value={this.course} ref="courseId" />
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
