import React, { Component } from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom"

//the Nav tools on the main swipe page
//Far left settings button, far right pairslist button
//Middle will have a button to accept the current job, and 
//left will have a button to reject the current job

class SwipeNav extends Component {
  render() {
      return (<div>SWIPE NAV TOOLS<br/>
      <Link to='/settings'><button>SETTINGS</button></Link><button>CHAT</button>
      <br/>
      <Link to={'/user'+this.props.id}><button>user</button></Link>
      </div>)
  }
}

const mapStateToProps = state => ({
  id: state.user.id
});

export default connect(mapStateToProps)(SwipeNav);
