import React, { Component } from 'react';

//form for adding a review
export default class ReviewForm extends Component{

  handleSubmit(event) {
      event.preventDefault();
  		var courseId = this.refs.courseId.value.trim();
      var rating = this.refs.rating.value.trim();
      var review = this.refs.review.value.trim();
      this.props.onReviewSubmit({courseId: courseId, rating: rating, review: review});
      this.refs.courseId.value = ''; //reset fields
      this.refs.rating.value = '';
  		this.refs.review.value = '';
  }

  render() {
    return (
      <form className='reviewForm' onSubmit={this.handleSubmit}>
				<input type='text' placeholder='Course ID' ref='courseId' />
        <input type='text' placeholder='Rating' ref='rating' />
        <input type='text' placeholder='Review' ref='review' />
        <input type='submit' value='Post' />
      </form>
    );
  }
}
