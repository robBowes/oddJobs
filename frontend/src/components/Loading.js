import React, {Component} from 'react';
import {connect} from 'react-redux';


// This component is a loading screen to appear while
// various components load

class Loading extends Component {
  render() {}
}

const mapStateToProps = (state) => ({
  // redux props import
});

export default connect(mapStateToProps)(Loading);
