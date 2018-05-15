import React, { Component } from "react";
import { connect } from "react-redux";

// A series of three unique steps for onboarding users on
//initial login. Will walk users through configuring
//their initial settings and explaining these settings
//one step at a time. Each step will advance a users
//welcome staging number. When users complete the third step
//They are never shown this page again

class WelcomeStaging extends Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.dispatch({type: 'INCREMENT_WELCOME'})
  }
  render() {
 return  (   <div className='welcomeStage1'>

      <img src='logo.png' alt='oddjobs logo'/>
      
      <h1 className='welcomeText'> Welcome! </h1>

      <button 
      className='welcomeButton'
      onClick={this.handleClick}
      >
      Setup
      </button>
    </div>
  )
}
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(WelcomeStaging);
