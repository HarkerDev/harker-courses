import React, { Component } from 'react';
import * as firebase from 'firebase';
import coursesData from '../courses.json';

var coursesArr = [];
for(var key in coursesData) {
    if (coursesData[key]!=null) {
        coursesArr.push([key, coursesData[key]]);
    }
}

//form for adding a review
export default class ReviewForm extends Component {

    constructor(props){
        super(props);
        console.log(props);
        this.state_props = props;
        this.course = this.state_props.course;
    }

    handleSubmit(event) {
        event.preventDefault();
        var courseId = this.refs.courseId.value.trim();
        var rating = this.refs.rating.value;
        var review = this.refs.review.value;
        // A post entry.
        var postData = {
            /*
            author: username,
            uid: uid,
            body: body,
            title: title,
            starCount: 0,
            authorPic: picture
            */
            courseId: courseId,
            rating: rating,
            review: review
        };

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + newPostKey] = postData;
        //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        console.log(firebase.database().ref().update(updates));
        //this.props.onReviewSubmit({courseId: courseId, rating: rating, review: review});
        this.refs.courseId.value = ''; //reset fields
        this.refs.rating.value = 0;
        this.refs.review.value = '';

        // TODO: Check return status, display error/success in field, bootstrap
        // it all, make appropriate input fields, etc.
    }

    componentWillMount() {
        const script = document.createElement("script");

        script.innerHTML = "setTimeout(function() { \
            $('.rating').rating(); \
        }, 200);";

        document.body.appendChild(script);
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
        return (
            <div>
                <form className='reviewForm' onSubmit={this.handleSubmit.bind(this)}>
                    <h3>Post a Review</h3>
                    <div className="input-group">
                        <label htmlFor="courseId">Course:</label>
                        <select className="form-control" ref="courseId" defaultValue={this.course}>
                        {coursesArr.map(function(obj, i){
                            return (
                                <option key={i} value={obj[0]}>{obj[1]["title"]}</option>
                            );
                        })}
                        </select>
                    </div>
                    <label htmlFor="rating">Rating:</label>
                    <div className="form-group">
                        <input type="hidden" className="rating rating-tooltip-manual" data-start="0" data-stop="5"
                        data-fractions="2" ref='rating' id="reviewRating"></input>
                    </div>
                    <div className="form-group">
                        <textarea className="form-control" rows="5" ref='review'
                        placeholder="Your review of this course here" />
                    </div>
                    <input type="submit" className="btn btn-info" value="Post Review!" />
                </form>
            </div>
        );
    }
}
