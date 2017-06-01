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
        this.submitted = undefined;
    }

    handleSubmit(event) {
        event.preventDefault();
        var that = this;
        firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				var displayName = user.displayName;
	            var email = user.email;
	            var emailVerified = user.emailVerified;
	            var photoURL = user.photoURL;
	            var uid = user.uid;
	            var providerData = user.providerData;
	            user.getToken().then(function(accessToken) {
					var login_info = {
	  	                displayName: displayName,
	  	                email: email,
	  	                emailVerified: emailVerified,
	  	                photoURL: photoURL,
	  	                uid: uid,
	  	                accessToken: accessToken,
	  	                providerData: providerData
					};
                    console.log(login_info);
                    var courseId = that.refs.courseId.value.trim();
                    var rating = that.refs.rating.value;
                    var review = that.refs.review.value;
                    // A review entry.
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
                    var newPostKey = firebase.database().ref().child('reviews').child(courseId).push().key;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/reviews/' + courseId + '/' + newPostKey] = postData;
                    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                    //console.log(firebase.database().ref().update(updates)); // // //
                    firebase.database().ref().update(updates).then(function(data){
                        // success
                        console.log(data);
                        that.submitted = "success";
                        that.forceUpdate();
                    }, function(err){
                        // error
                        console.log("ERROR!");
                        that.submitted = "failure";
                        that.forceUpdate();
                    })
                    //this.props.onReviewSubmit({courseId: courseId, rating: rating, review: review});
                    /*that.refs.courseId.value = ''; //reset fields
                    that.refs.rating.value = 0;
                    that.refs.review.value = '';*/

                    // TODO: Check return status, display error/success in field, bootstrap
                    // it all, make appropriate input fields, etc.
                });
            }
        });
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
        if(this.submitted === undefined){
            return (
                <div>
                    <form className='reviewForm' onSubmit={ this.handleSubmit.bind(this) }>
                        <h3>Post a Review</h3>
                        <div className="input-group">
                            <label htmlFor="courseId">Course:</label>
                            <select className="form-control" ref="courseId" defaultValue={this.course}>
                            {coursesArr.map(function(obj, i){
                                return (
                                    <option key={i} value={obj[0]}>{ obj[1]["title"] }</option>
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
        } else if(this.submitted === "success"){
            return (
                <div className='reviewForm alert alert-success'>
                    <span className="glyphicon glyphicon-ok"></span>&nbsp;<strong>Success!</strong> Posted review.
                </div>
            );
        } else if(this.submitted === "failure"){
            return (
                <div className='reviewForm alert alert-danger'>
                    <span className="glyphicon glyphicon-remove"></span>&nbsp;<strong>Error!</strong> Unable to post review.
                </div>
            );
        }
    }
}
