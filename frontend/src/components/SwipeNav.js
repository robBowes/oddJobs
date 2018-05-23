import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

// the Nav tools on the main swipe page
// Far left settings button, far right pairslist button
// Middle will have a button to accept the current job, and
// left will have a button to reject the current job

class SwipeNav extends Component {
  hasListedPairs = () => {
    return this.props.user.jobsListed.some(x => x.pairedHelpers.length>0) || this.props.user.pairs.length>0
  }
  render() {
      return (<div className="swipeNav">
      <div className="navBar">
      <Link className="settingsLink" to='/settings'><button className="imageButton"><img className="navImage" src="/settings.png"/></button></Link>
      <Link className="jobsLink" to='/currentjobs'><button className="imageButton"><img className="navImage" src={this.hasListedPairs()?"/chatsglow.png":"/chats.png"}/></button></Link>
      </div>      
      </div>);
  }
}

const mapStateToProps = (state) => ({
  id: state.user.id,
  user: state.user,
});

export default connect(mapStateToProps)(SwipeNav);
