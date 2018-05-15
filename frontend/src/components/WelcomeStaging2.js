import React, { Component } from "react";
import { connect } from "react-redux";

// A series of three unique steps for onboarding users on
//initial login. Will walk users through configuring
//their initial settings and explaining these settings
//one step at a time. Each step will advance a users
//welcome staging number. When users complete the third step
//They are never shown this page again

class WelcomeStaging extends Component {
  constructor(props){
    super(props)
    this.state = {
       sliderValue: 50,
       minPayValue: 0,
       maxPayValue: 40,
       categories: []
    }
  }
  handleClickNext = (event) => {
    event.preventDefault();
    this.props.dispatch({
      type: 'WELCOME_STATE',
      payload: 2,
  })
  }
  sliderChange = (event) => {
    this.setState({sliderValue: event.target.value})
  }
  handleMinChange = (event) => {
    event.preventDefault();
    this.setState({minPayValue: event.target.value})
  }
  handleMaxChange = (event) => {
    event.preventDefault();
    this.setState({maxPayValue: event.target.value})
  }
  handleSubmit = (event) => {
   event.preventDefault()
  }
  render() {
 return  (   <div className='welcomeStage1'>      
      <h1 className='welcomeText'> Let's start by setting up your job preferences!</h1>

      <form className='welcomeForm' onSubmit={this.handleSubmit}>
       <h2 className='welcomeHeader'> Show Jobs Within: </h2>
       <input type="range" min="1" max="100" value={this.state.sliderValue} onChange={this.sliderChange} className="kmSlider" id="welcomeSlider"/>
       <h2 className='welcomeHeader'> Show Jobs Paying: </h2>
       <input className='welcomeInputMinMax' value={this.state.minPayValue} onChange={this.handleMinChange} type="number" placeholder="from"/> 
       - <input className='welcomeInputMinMax' value={this.state.maxPayValue} onChange={this.handleMaxChange} type="number" placeholder="to"/>
        



      <button 
      type="sumbit"
      className='welcomeButton'
      onClick={this.handleClickNext}
      >
      Next
      </button>
      </form>
    </div>
  )
}
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(WelcomeStaging);
