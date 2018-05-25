import Checkbox from 'rmwc/Checkbox';
import FormField from 'rmwc/FormField';

import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from './courses.json';
import { ReviewScore } from './Review.js';

export default class ReviewBox extends Component {
    render() {
        return <div className="review-box mdc-elevation--z2" style={this.state && this.state.style}>
            <div className="title mdc-typography--headline6">Reviewing '{coursesData[this.props.courseId].title}'</div>
            <input className="review-input-title" placeholder="Review Title" onChange={this.onTitleChange.bind(this)} />
            <textarea className="review-input" placeholder="Write a review..." onChange={this.onTextareaChange.bind(this)}></textarea>

            <div className="rating-row">
                <FormField id="labeled-checkbox">
                    <Checkbox
                        onChange={({ target: { checked } }) => {
                            this.setState({ anonymous: checked });
                        }}
                        checked={this.state && this.state.anonymous}
                    />
                    <label>Post Anonymously</label>
                </FormField>
                <div className="spacer"></div>
                <RatingBox error={this.state && this.state.ratingError} onRatingChange={this.onRatingChange.bind(this)} stars={5} />
            </div>

            <div className="mdc-card__actions review-actions">
                <div className="mdc-card__action-buttons">
                    <button className="mdc-button mdc-card__action mdc-card__action--button" onClick={() => this.submit() && this.props.onCloseRequest()}>Submit</button>
                    <button className="mdc-button mdc-card__action mdc-card__action--button" onClick={this.props.onCloseRequest}>Cancel</button>
                </div>
            </div>
        </div>
    }

    onTextareaChange(e) {
        this.reviewText = e.target.value;
    }

    onTitleChange(e) {
        this.reviewTitle = e.target.value;
    }

    onRatingChange(rating) {
        this.rating = rating;
        this.setState({ ratingError: false });
    }

    submit() {
        var error = false;
        if (!this.rating) { this.setState({ ratingError: true }); error = true; }

        if (error) return false;
        var review = {
            title: this.reviewTitle,
            text: this.reviewText,
            rating: this.rating,
            anonymous: !!this.state.anonymous //coerce to bool
        };
        this.postReview(review);
        return true;
    }

    componentWillReceiveProps(props) {
        props.show ? this.show() : this.hide();
    }

    show() {
        var course = document.querySelector(".course");
        var rect = course.getBoundingClientRect();
        this.setState(
            {
                style: {
                    minHeight: rect.height + "px",
                    width: rect.width + "px"
                }
            }
        );
        setTimeout(() => {
            course.style.display = "none";
            this.setState({
                style: {
                    minHeight: rect.height + "px",
                    width: rect.width + "px",
                    position: "static"
                }
            });
        }, 150);
    }

    hide() {
        var course = document.querySelector(".course");
        course.style.display = "block";
        this.setState(
            {
                style: {
                    minHeight: "0px",
                    width: "0px",
                    position: "absolute"
                },
                value: ""
            }
        );
    }

    postReview(review) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const { displayName, uid } = user;
                user.getToken().then((accessToken) => {
                    //console.log(loginInfo);
                    const courseId = this.props.courseId;
                    const title = review.title || "";
                    const rating = review.rating;
                    const reviewText = review.text || "";
                    // A review entry.
                    const postData = {
                        courseId, rating, title, review: reviewText, author: (review.anonymous ? "Anonymous" : displayName), poster_uid: uid, timestamp: Date.now(),
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
                        //console.log(data);
                        if (this.props.onSubmitted) this.props.onSubmitted(true);
                    }, (err) => {
                        // error
                        console.log('ERROR!', err);
                        if (this.props.onSubmitted) this.props.onSubmitted(false);
                    });
                });
            }
        });
    }
}

export class RatingBox extends Component {
    constructor(props) {
        super(props);

        this.state = { ratingArray: new Array(props.stars).fill(0), error: this.props.error };
    }

    render() {
        return <div className={"rating-box " + ((this.state && this.state.error) ? " error " : " ") + ((!this.state || this.state.rated) ? ReviewScore.resolveClassName(this.rating) : "hover")} onClick={this.setRating.bind(this)} onMouseMove={this.setRatingPreview.bind(this)}>
            {this.state &&
                this.state.ratingArray.map((el, index) => <div key={index} className="rating-star material-icons">{el === 0 ? "star_border" : (el === 0.5 ? "star_half" : "star")}</div>)
            }
            <div className="score mdc-typography--headline6">{this.rating || "0"}</div>
        </div>
    }

    componentWillReceiveProps(props) {
        this.setState({ error: props.error });
    }

    getRatingAtPoint(e) {
        var starBox = document.querySelector(".rating-box .rating-star").getBoundingClientRect();
        var starWidth = starBox.width + 7; //add margin
        var starX = starBox.left;
        var offset = e.pageX - starX;
        var preciseRating = offset / starWidth;
        if (preciseRating > this.props.stars) return false;

        var halfRating = Math.round(preciseRating * 2) / 2;
        if (halfRating === 0) return false;

        this.rating = halfRating;

        var ratingArray = this.state.ratingArray;
        for (var i = 0; i < ratingArray.length; i++ , halfRating--) {
            ratingArray[i] = (halfRating >= 1 ? 1 : (halfRating === 0.5 ? 0.5 : 0));
        }
        this.setState({ ratingArray });
        return true;
    }

    setRating(e) {
        if (!this.getRatingAtPoint(e)) return;
        this.setState({ rated: true });
        this.props.onRatingChange(this.rating);
    }

    setRatingPreview(e) {
        if (this.state.rated || !this.getRatingAtPoint(e)) return;

        this.setState({ rated: false });
    }
}