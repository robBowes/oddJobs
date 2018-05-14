import React, { Component } from "react";
import { connect } from "react-redux";

//The PairsList component will render a given users pairs
//Pairs for jobs posted and jobs applied for will appear in different colors
//selecting a job will show a list of connected helpers to link to Chat app
//if a user selects a job to which they are connected to exactly one other user
//They will be taken directly to the chat
//If a user selects a job to which they are connected to exactly zero other users
//placeholder text/image will appear

class PairsList extends Component {
  render() {}
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(PairsList);
