import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Swing, { Stack, Card, Direction } from "react-swing";

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
      stack: null,
      cards: []
    };
  }
  swipeRight = x => {
      if(this.state.cards.length>0){
    const target = this.refs.stack.refs[
      this.state.cards[this.state.cards.length - 1].ref
    ];

    // get Target Dom Element
    const el = ReactDOM.findDOMNode(target);

    // stack.getCard
    const card = this.state.stack.getCard(el);

    // throwOut method call
    card.throwOut(0, 0, Swing.DIRECTION.RIGHT);
}
  };

  swipeLeft = x => {
      if(this.state.cards.length>0){
    // Swing Card Directions

    // Swing Component Childrens refs
    const target = this.refs.stack.refs[
      this.state.cards[this.state.cards.length - 1].ref
    ];

    // get Target Dom Element
    const el = ReactDOM.findDOMNode(target);

    // stack.getCard
    const card = this.state.stack.getCard(el);

    // throwOut method call
    card.throwOut(0, 0, Swing.DIRECTION.LEFT);
    //    let b = {}
    //    b.target = target
    //this.removeCard(b)
  }};

  removeCard = e => {
    const target = e.target;
    const el = ReactDOM.findDOMNode(target);
    const card = this.state.stack.getCard(el);
    //card.destroy();
    console.log(target.id);
    // el.remove()
    this.setState({
      cards: this.state.cards.filter((x, i) => {
        return parseInt(x.key) !== this.state.cards.length - 1;
      })
    });
  };
  renderCards = () => {
    let newStack = [];
    for (let i = newStack.length; i < 10; i++) {
      newStack = newStack.concat(
        <div
          key={i}
          className={"card " + (parseInt(i) + 1)}
          ref={"card" + (parseInt(i) + 1)}
          id={i}
        >
          <img
            draggable="false"
            src={
              "http://unsplash.it/" +
              Math.round(Math.random() * (305 - 295) + 295) +
              "/" +
              Math.round(Math.random() * (255 - 245) + 245)
            }
          />
          <div
            style={{
              flex: "none",
              fontSize: "10pt",
              top: "5%",
              backgroundColor: "white",
              position: "absolute"
            }}
          >
            LMAO{i}
          </div>
        </div>
      );
    }
    this.props.dispatch({
      type: "UPDATE_STACK",
      payload: newStack
    });
    if (this.state.cards.length === 0) {
      this.setState({ cards: newStack });
    }
    console.log(newStack);
    return newStack;
  };
  componentWillMount = props => {
    this.renderCards();
  };
  accept = e => {
    console.log(e);
    console.log("YES THIS JOB");
  };

  reject = e => {
    console.log(e);
    console.log("NOT THIS JOB");
  };

  render() {
    console.log(Swing);
    return (
      <div className="swipeContainer">
        SWIPER
        <Swing
          className="stack"
          tagName="div"
          setStack={stack => this.setState({ stack: stack })}
          ref="stack"
          throwoutend={this.removeCard}
          throwoutleft={this.reject}
          throwoutright={this.accept}
        >
              <div style={{'position':'absolute', 'bottom':'20%', 'left':'10%'}}>NO MORE CARDS</div>
          {this.state.cards ? (
            this.state.cards.map(x => {
              return x;
            })
          ) : (
            <div />
          )}
        </Swing>
        <div>
          <button type="button" name="accept" onClick={this.swipeRight}>
            ACCEPT
          </button>
          <button type="button" onClick={this.swipeLeft}>
            Reject
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cards: state.data.cards
});

export default connect(mapStateToProps)(Swiper);
