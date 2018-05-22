import React, {Component} from 'react';
import {connect} from 'react-redux';
import Animate from 'react-smooth';

// A series of three unique steps for onboarding users on
// initial login. Will walk users through configuring
// their initial settings and explaining these settings
// one step at a time. Each step will advance a users
// welcome staging number. When users complete the third step
// They are never shown this page again

class WelcomeStaging extends Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.dispatch({
      type: 'WELCOME_STATE',
      payload: 1,
  });
  }
  render() {
 return ( 
  <Animate to={"0.99"} from={"0.01"} attributeName="opacity" duration={1000}>
 <div className='welcomeStage1'>
      <div className="logoWrapper">
      <img className="logo" src='logo.png' alt='oddjobs logo'/>
      </div>

      <div className="textWrapper">
      <h1 className="welcomeText"> Welcome! </h1>
      </div>

      <div className="buttonWrapper">
      <button
      className='welcomeButton'
      onClick={this.handleClick}
      >
      Setup
      </button>
      </div>
    </div>
    </Animate>
  );
}
}

const mapStateToProps = (state) => ({
  // redux props import
});

export default connect(mapStateToProps)(WelcomeStaging);
