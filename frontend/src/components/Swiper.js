import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import Swing from 'react-swing';
import {Link} from 'react-router-dom';
import {MoonLoader} from 'react-spinners';
import SwipeNav from './../components/SwipeNav.js';
import Animate from 'react-smooth';

// The main function of the app
// A constantly rotating pair of jobs giving the impression of continuous flow
// users will select yes or no, swiping left or right on jobs

class Swiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stack: null,
      cards: [],
      loading: true,
    };
    this.numberOfPicturesLoaded = 0;
  }
  componentWillReceiveProps = (props) => {
    //
  };

  componentDidMount = () => {
    // let pairs = this.props.user.jobsListed.map((jobObj)=>jobsObj.pairs).flatten();
    // // this.props.dispatch({type: 'SET_PAIRS', payload: pairs});
    // // todo write action
    // setInterval(()=>{
    //   fetch('/user', {
    //     method: 'POST',
    //     credentials: 'same-origin',
    //     body: JSON.stringify({id: this.props.user.id}),
    //   })
    //   .then((x)=>x.json())
    //   .then((y)=>{
    //     let newPairs = y.user.jobsListed.map((jobObj)=>jobsObj.pairs).flatten();
    //     if (y.length>pairs.length) {
    //       // todo add notification
    //     }
    //     // this.props.dispatch({type: 'SET_PAIRS', payload: pairs});
    //   });
    // },
    // 30000);
  };

  swipeRight = (x) => {
    if (this.state.cards.length > 0) {
      const target = this.refs.stack.refs[
        this.state.cards[this.state.cards.length - 1].ref
      ];

      // get Target Dom Element
      const el = ReactDOM.findDOMNode(target);
      console.log(el);
      // stack.getCard
      const card = this.state.stack.getCard(el);
      console.log('CARD', card, 'STACK', this.state.stack);
      // throwOut method call
      card.throwOut(0, 0, Swing.DIRECTION.RIGHT);
    }
  };

  swipeLeft = (x) => {
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
  allPicturesLoaded = (totalPics) => {
    this.numberOfPicturesLoaded++;
    if (this.numberOfPicturesLoaded >= totalPics) {
      this.props.dispatch({type: 'TOGGLE_LOADING'});
    }
  };
  removeCard = (e) => {
    // const target = e.target;
    // const el = ReactDOM.findDOMNode(target);
    // const card = this.state.stack.getCard(el);
    // card.destroy();
    // el.remove()
    let lat;
    let lng;
    navigator.geolocation.getCurrentPosition((x) => {
      lat = x.coords.latitude;
      lng = x.coords.longitude;
    });

    this.setState({
      cards: this.state.cards.filter((x, i) => {
        return parseInt(x.key) !== this.state.cards.length - 1;
      }),
    });
  };
  renderCards = () => {
    let newStack = [];
    let jobs = this.props.jobs;
    if (!jobs) jobs = [];
    let filterOwn = jobs.filter((x) => {
      return x.patronId !== this.props.user.id;
    });

    let filterRej = filterOwn.filter((x) => {
      for (let i = 0; i < this.props.rejected.length; i++) {
        if (this.props.rejected[i] === x.id) {
          return false;
        }
      }
      return true;
    });

    let jobsShown = filterRej.filter((x) => {
      for (let i = 0; i < this.props.user.pairs.length; i++) {
        if (this.props.user.pairs[i].id === x.id) {
          return false;
        }
      }
      return true;
    });
    if (jobsShown.length===0) this.allPicturesLoaded(0);


    for (let i = 0; i < jobsShown.length; i++) {
      newStack = newStack.concat(
        <div
        key={i}
        className={'card ' + (parseInt(i) + 1)}
        ref={'card' + (parseInt(i) + 1)}
        id={i}
        jobid={jobsShown[i].id}
        >
        <img
        className="cardImage"
        draggable="false"
        src={jobsShown[i].picture}
        alt=""
        onLoad={() => this.allPicturesLoaded(jobsShown.length)}
        onError={() => this.allPicturesLoaded(jobsShown.length)}
        />
        <Link to={'/job' + jobsShown[i].id}>
        <div className="bottomBar">
        <div className="jobDetails">
        <span className="jobDistance">{Math.ceil(jobsShown[i].distance/100)/10} km</span>
        <span className="jobTitle">{jobsShown[i].jobTitle}</span>
        <span className="jobPay">{'$' + jobsShown[i].jobPay}</span>
        </div>
        </div>
        </Link>
        </div>
      );
    }
    this.props.dispatch({
      type: 'UPDATE_STACK',
      payload: newStack,
    });
    if (this.state.cards.length === 0) {
      this.setState({cards: newStack});
    }
    return newStack;
  };
  componentWillMount = (props) => {
    this.props.dispatch({type: 'TOGGLE_LOADING'});
    fetch('/allJobs', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({location: this.props.user.location}),
    })
    .then((x) => x.json())
    .then((y) => {
      if (!y.status) console.log(y);
      this.props.dispatch({
        type: 'UPDATE_JOBS',
        payload: y.content,
      });
      this.renderCards();
      this.setState({loading: false});
    });
  };
  accept = (e) => {
    const target = e.target;
    const el = ReactDOM.findDOMNode(target);
    // const card = this.state.stack.getCard(el);
    let jobId = target.getAttribute('jobid');
    console.log(jobId);
    fetch('/pair', {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({id: jobId}),
    })
    .then((x) => x.json())
    .then((y) => {
      if (!y.status) console.log(y);
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user,
      });
    });
  };

  reject = (e) => {
    const target = e.target;
    const el = ReactDOM.findDOMNode(target);
    // const card = this.state.stack.getCard(el);
    let jobId = target.getAttribute('jobid');
    this.props.dispatch({
      type: 'LEFT_SWIPE',
      payload: jobId,
    });
  };

  render() {
    return this.state.loading ? (
      <div />
    ) : (<Animate to={'0.99'} from={'0.01'} attributeName="opacity" duration={1000}>
      <div className="swipeContainer">
        <div className="addJobContainer">
          <Link to="/listjob">
            <button className="addJobButton">
            </button>
          </Link>
        </div>
        <div className="logoContainer">
          <img className="logo2" src="logo.png" alt="oddjobs logo" />
        </div>

    <div className="stackContainer">
    <Swing
    className="stack"
    tagName="div"
    setStack={(stack) => this.setState({stack: stack})}
    ref="stack"
    throwoutend={this.removeCard}
    throwoutleft={this.reject}
    throwoutright={this.accept}
    >
    <div className="noCards" />
    {this.state.cards ? (
      this.state.cards.map((x) => {
        return x;
      })
    ) : (
      <div />
    )}
    </Swing>
    </div>
    <SwipeNav />
    <div className="acceptReject">
    <button
    id="x"
    className="swipeButton"
    type="button"
    onClick={this.swipeLeft}
    />
    <button
    id="check"
    className="swipeButton"
    type="button"
    name="accept"
    onClick={this.swipeRight}
    />
    </div>
    </div>
    </Animate>
  );
}
}

const mapStateToProps = (state) => ({
  rejected: state.data.rejected,
  cards: state.data.cards,
  jobs: state.data.jobs,
  user: state.user,
});

export default connect(mapStateToProps)(Swiper);
