import React, { Component } from "react";
import { connect } from "react-redux";

//This component renders the settings page and options for user
//Users are able to see their current settings
//and manipulate these settings via input boxes or sliders
//show Image and Username
//edit description, Categories, radius(slider) and min-max pay(input boxes)

class UserSettings extends Component {
  render() {}
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(UserSettings);
