import React, { Component } from "react";
import { connect } from "react-redux";

//The main function of the app
//A constantly rotating pair of jobs giving the impression of continuous flow
//users will select yes or no, swiping left or right on jobs
//2 jobs loaded at a time, a job currently shown and a next job loaded to show the user
//when a decision is made on the top level job, the second job will move to the front
//and the frontend wll request a second job from the server
//The Swiper will interact with SwipeNav through props

class Swiper extends Component {
  render() {
      return (
          <div>SWIPER</div>
      )
  }
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(Swiper);
