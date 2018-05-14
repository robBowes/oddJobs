import React, { Component } from "react";
import { connect } from "react-redux";

// A series of three unique steps for onboarding users on 
//initial login. Will walk users through configuring 
//their initial settings and explaining these settings
//one step at a time. Each step will advance a users
//welcome staging number. When users complete the third step
//They are never shown this page again

class WelcomeStaging extends Component {
  render() {}
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(WelcomeStaging);
