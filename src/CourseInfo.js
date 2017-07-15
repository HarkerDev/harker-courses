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
  
  setUpListeners() {
  	var postRef = firebase.database().ref().child('reviews').child(this.course);
  	var that = this;
  	postRef.on('child_added', function(data) {
  		//addCommentElement(postElement, data.key, data.val().text, data.val().author);
  		var data_key = data.key;
  		data = data.val();
  		data.key = data_key;
  		that.reviews.push(data);
  		that.forceUpdate();
  	});
  	postRef.on('child_changed', function(data) {
  		var data_key = data.key;
  		data = data.val();
  		for(var i = 0; i < that.reviews.length; i++){
  			var on = that.reviews[i];
  			if(on.key === data_key){
  				for(var key in data){
  					that.reviews[i][key] = data[key];
  				}
  				break;
  			}
  		}
  		that.forceUpdate();
  	});
  	postRef.on('child_removed', function(data) {
  		var data_key = data.key;
  		var idx = -1;
  		for(var i = 0; i < that.reviews.length; i++){
  			if(that.reviews[i].key === data_key){
  				idx = i;
  				break;
  			}
  		}
  		that.reviews.splice(idx, 1); // delete review
  		that.forceUpdate();
  	});
  	// (see https://firebase.google.com/docs/database/web/lists-of-data)
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

  render() {
	return (
	<div>
	  {this.reviews.map(data =>
		<div key={data.key}>{data.authorName} {data.authorPhoto ? (<img src={data.authorPhoto} />) : ""} rated the course: {data.rating} stars and posted: {data.review}</div>
	  )}
	</div>
	);
  }
}
