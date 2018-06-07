import React, { Component } from 'react';
import { SimpleMenu, MenuItem } from 'rmwc/Menu';
import Snackbar from 'rmwc/Snackbar';
import * as firebase from 'firebase';
import { SimpleDialog } from 'rmwc/Dialog';


export default class Review extends Component {

  componentWillMount(){
    var hash = window.location.hash;
    if (hash)
      this.isShared = this.props.review.key === hash.substring(1);
  }

  render() {
    if (!this.props.review.title && !this.props.review.review) return null;
    // can't delete reviews yet - <li className="mdc-list-item" role="menuitem" tabindex="0"><i className="material-icons">close</i> Delete</li>
    return <div className={"review mdc-card" + (this.isShared ? " shared" : "")} id={this.props.review.key}>
      <div className="info">
        <div className="user">
          <span className="mdc-typography--headline6">{this.props.review.title || "Untitled Review"}</span>
          <span className="mdc-typography--subtitle2 author-name">{this.props.review.author || "Anonymous"}</span>
        </div>
        <div className="spacer"></div>
        <ReviewScore rating={this.props.review.rating} />
        <ReviewActions onMenuItemClicked={this.onMenuItemClicked.bind(this)} onShareClicked={this.onShareClicked.bind(this)} />
      </div>
      {this.props.review && <div className="text mdc-typography--body2">{this.props.review.review}</div>}
      <ReviewDate timestamp={this.props.review.timestamp} />
      <Snackbar
        onHide={() => { this.setState({ flagFailed: false, flagged: false }); }}
        show={this.state && (this.state.flagFailed || this.state.flagged)}
        message={this.state ? (this.state.flagFailed ? "Failed to Flag Review" : "Flagged Review as Inappropriate") : ""}
      />
      <SimpleDialog
        title="Share Review"
        body={this.state && this.state.shareLink}
        open={!!(this.state && this.state.shareOpen)}
        onClose={() => this.setState({ shareOpen: false })}
        acceptLabel="Okay"
        cancelLabel={null}
      />
    </div>
  }

  componentDidMount(){
    if (!this.isShared) return;
    // scroll to
    var el = document.getElementById(this.props.review.key);
    if (!el) return;
    el.scrollIntoView(true);
    // hide snackbar because it likes to show during the animation
    var sb = el.querySelector(".mdc-snackbar");
    sb.style.display = "none";
    setTimeout(() => sb.style.display = "block", 510);
  }

  onMenuItemClicked(index) {
    var ref = firebase.database().ref('flagged_reviews').push();
    var review = this.props.review;
    var user = FirebaseAuth.getInstance().getCurrentUser();
    review.flaggedBy = user && user.getEmail();
    ref.set(review, (error) => {
      if (error) {
        this.setState({ flagFailed: true });
        console.log("Error flagging review", error);
      } else
        this.setState({ flagged: true });
    })
  }

  onShareClicked() {
    window.location.hash = this.props.review.key;
    this.setState({ shareOpen: true, shareLink: window.location.href });
  }
}

export class ReviewDate extends Component {
  formatDate() {
    var date = new Date(this.props.timestamp);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthStr = months[date.getMonth()];

    return `${monthStr} ${date.getDate()}, ${date.getFullYear()}`;
  }

  render() {
    return <div className="date mdc-typography--subtitle2">Posted on {this.formatDate()}</div>;
  }
}

export class ReviewScore extends Component {
  render() {
    var className = ReviewScore.resolveClassName(this.props.rating);
    if (!this.props.rating)
      return <div className="rating-score mdc-typography--headline6">No Reviews</div>;
    else
      return <div className={"rating-score " + className + " mdc-typography--headline6"}>{this.props.rating.toFixed(1)} <i className="material-icons rating-star">star</i></div>;
  }

  static resolveClassName(rating) {
    if (rating >= 4) return "good";
    else if (rating >= 3) return "okay";
    else if (rating >= 2) return "poor";
    else if (rating >= 0.5) return "bad";
    return "";
  }
}

export class ReviewActions extends Component {
  render() {
    return <div className="actions">
      <i className="material-icons mdc-card__action mdc-card__action--icon mdc-ripple-surface" onClick={this.onAction.bind(this)} data-mdc-ripple-is-unbounded role="button" title="Share">share</i>

      <SimpleMenu
        handle={<i className="material-icons mdc-card__action mdc-card__action--icon mdc-ripple-surface" data-mdc-ripple-is-unbounded role="button" title="More" id="menu-button">more_vert</i>}
        onSelected={this.onAction.bind(this)}>
        <MenuItem><i className="material-icons">flag</i> Flag as Inappropriate</MenuItem>
      </SimpleMenu>
    </div>
  }

  onAction(evt) {
    // evt only has index property if it came from the menu
    if (evt.detail.index !== undefined && this.props.onMenuItemClicked) this.props.onMenuItemClicked(evt.detail.index);
    else if (this.props.onShareClicked) this.props.onShareClicked();
  }
}