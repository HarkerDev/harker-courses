import React, { Component } from 'react';
import TextField from 'rmwc/TextField';

export default class SearchBar extends Component {
  render() {
    return <TextField outlined withLeadingIcon="search" label="Search for Courses" onChange={this.onChange.bind(this)}/>;
  }

  onChange(e){
    if (this.props.onQuery) this.props.onQuery(e.target.value);
  }
}