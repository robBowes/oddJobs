import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Swing from "react-swing";
import { Link } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import SwipeNav from "./../components/SwipeNav.js";

// The main function of the app
// A constantly rotating pair of jobs giving the impression of continuous flow
// users will select yes or no, swiping left or right on jobs

class Swiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stack: null,
      cards: [],
      loading: true
    };
  }
  componentWillReceiveProps = props => {
    //
  };
  swipeRight = x => {
    if (this.state.cards.length > 0) {
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
    if (this.state.cards.length > 0) {
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
      // this.removeCard(b)
    }
  };

  removeCard = e => {
    // const target = e.target;
    // const el = ReactDOM.findDOMNode(target);
    // const card = this.state.stack.getCard(el);
    // card.destroy();
    // el.remove()
    let lat;
    let lng;
    navigator.geolocation.getCurrentPosition(x => {
      lat = x.coords.latitude;
      lng = x.coords.longitude;
    });

    this.setState({
      cards: this.state.cards.filter((x, i) => {
        return parseInt(x.key) !== this.state.cards.length - 1;
      })
    });
  };
  renderCards = () => {
    let newStack = [];
    let jobs = this.props.jobs;
    if (!jobs) jobs = [];
    let filterOwn = jobs.filter(x => {
      return x.patronId !== this.props.user.id;
    });
    let jobsShown = filterOwn.filter(x => {
      for (let i = 0; i < this.props.rejected.length; i++) {
        if (this.props.rejected[i] === x.id) {
          return false;
        }
      }
      return true;
    });

    for (let i = 0; i < jobsShown.length; i++) {
      newStack = newStack.concat(
        <div
          key={i}
          className={"card " + (parseInt(i) + 1)}
          ref={"card" + (parseInt(i) + 1)}
          id={i}
          jobid={jobsShown[i].id}
        >
          <img
            className="cardImage"
            draggable="false"
            src={jobsShown[i].picture}
            alt=""
          />
          <Link to={"/job" + jobsShown[i].id}>
            <div className="bottomBar">
              <div className="jobDetails">
                <span className="jobDistance">{"20km"}</span>
                <span className="jobTitle">{jobsShown[i].jobTitle}</span>
                <span className="jobPay">{"$" + jobsShown[i].jobPay}</span>
              </div>
            </div>
          </Link>
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
    return newStack;
  };
  componentWillMount = props => {
    fetch("/allJobs", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ location: this.props.user.location })
    })
      .then(x => x.json())
      .then(y => {
        this.props.dispatch({
          type: "UPDATE_JOBS",
          payload: y.content
        });
        this.renderCards();
        this.setState({ loading: false });
      });
  };
  accept = e => {
    const target = e.target;
    const el = ReactDOM.findDOMNode(target);
    // const card = this.state.stack.getCard(el);
    let jobId = target.getAttribute("jobid");
    console.log(jobId);
    fetch("/pair", {
      method: "PUT",
      credentials: "same-origin",
      body: JSON.stringify({ id: jobId })
    })
      .then(x => x.json())
      .then(y => {
        this.props.dispatch({
          type: "USER_UPDATE",
          payload: y.user
        });
      });
    console.log("YES THIS JOB");
  };

  reject = e => {
    const target = e.target;
    const el = ReactDOM.findDOMNode(target);
    // const card = this.state.stack.getCard(el);
    let jobId = target.getAttribute("jobid");
    this.props.dispatch({
      type: "LEFT_SWIPE",
      payload: jobId
    });
    console.log("NOT THIS JOB");
  };

  render() {
    return this.state.loading ? (
      <div style={{ left: "40vw", top: "30vh", position: "absolute" }}>
        <MoonLoader color="#05ff05" loading={this.state.loading} />
      </div>
    ) : (
      <div className="swipeContainer">
        <div className="addJobContainer">
          <Link to="/listjob">
            <button className="addJobButton">+</button>
          </Link>
        </div>
        <div className="logoContainer">
          <img className="logo2" src="logo.png" alt="oddjobs logo" />
        </div>

        <div className="stackContainer">
          <Swing
            className="stack"
            tagName="div"
            setStack={stack => this.setState({ stack: stack })}
            ref="stack"
            throwoutend={this.removeCard}
            throwoutleft={this.reject}
            throwoutright={this.accept}
          >
            <div className="noCards" />
            {this.state.cards ? (
              this.state.cards.map(x => {
                return x;
              })
            ) : (
              <div />
            )}
          </Swing>
        </div>
        <SwipeNav />
        <div className="acceptReject">
          <button className="swipeButton" type="button" onClick={this.swipeLeft}>
            Reject
          </button>
          <button className="swipeButton" type="button" name="accept" onClick={this.swipeRight}>
            ACCEPT
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rejected: state.data.rejected,
  cards: state.data.cards,
  jobs: state.data.jobs,
  user: state.user
});

export default connect(mapStateToProps)(Swiper);
