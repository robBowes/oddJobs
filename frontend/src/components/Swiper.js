import React, { Component } from "react";
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import Swing, {Stack, Card, Direction   } from 'react-swing'

//The main function of the app
//A constantly rotating pair of jobs giving the impression of continuous flow
//users will select yes or no, swiping left or right on jobs
//2 jobs loaded at a time, a job currently shown and a next job loaded to show the user
//when a decision is made on the top level job, the second job will move to the front
//and the frontend wll request a second job from the server
//The Swiper will interact with SwipeNav through props

class Swiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stack: null
    };
  }
  swipe = (x) => {
      console.log(x)
    // Swing Card Directions
    console.log("Swing.DIRECTION", Swing.DIRECTION);

    // Swing Component Childrens refs
    const target = this.refs.stack.refs.card2;

    // get Target Dom Element
    const el = ReactDOM.findDOMNode(target);

    console.log(el)

    // stack.getCard
    const card = this.state.stack.getCard(el);

    // throwOut method call
    card.throwOut(100, 200, Swing.DIRECTION.RIGHT);
  };

  render() {
    console.log(Swing);
    return <div className="swipeContainer">
        SWIPER
        <Swing className="stack" tagName="div" setStack={stack => this.setState(
              { stack: stack }
            )} ref="stack" throwout={e => console.log("throwout", e)}>
          <div className="card clubs" ref="card1" throwout={e => console.log("card throwout", e)}>
            <img src={//this.props.jobs[0].picture
                "http://unsplash.it/300/250"} />
          </div>
          <div className="card diamonds" ref="card2">
            <img src={//this.props.jobs[1].picture
                "http://unsplash.it/301/250"} />
          </div>
          <div className="card diamonds" ref="card3">
            <img src={//this.props.jobs[1].picture
                "http://unsplash.it/300/248"} />
          </div>
        </Swing>
        <div>
        <button type="button" onClick={this.swipe}>
          ACCEPT
        </button>
        <button type="button" onClick={this.swipe}>
          Reject
        </button>
        </div>
      </div>;
  }
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(Swiper);
