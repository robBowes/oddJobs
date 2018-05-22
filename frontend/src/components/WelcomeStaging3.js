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
  constructor(props) {
    super(props);
    this.state = {
      description: '',
    };
  }
  handleClickNext = (event) => {
    event.preventDefault();
    fetch('/modify', {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        description: this.state.description,
        welcomeStage: 3,
      }),
    })
    .then((x) => x.json())
    .then((y) => {
      console.log(y);
      if (!y.status) throw new Error(y.reason);
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user,
      });
    });
  };
  handleChange = (event) => {
    event.preventDefault();
    this.setState({description: event.target.value});
  };
  handleSubmit = (event) => {
    event.preventDefault();
  };
  render() {
    return (      <Animate to={"translateX(0%)"} from={"translateX(300%)"} attributeName="transform" duration={500}>

    <div className="welcomeStage3">

        <div className="userPictureContainer">
        <img className="userPicture" src={this.props.picture} alt="user Profile" />
        </div>


        <h1 className="welcomeName">  {this.props.name} </h1>

        <h1 className="welcomeText2"> Tell us about yourself!</h1>


        <form onSubmit={this.handleSubmit}>

        <div className="descriptionWrapper">
          <textarea className="welcomeDescriptionInput" value={this.state.description} onChange={this.handleChange} type="textarea" placeholder="This is who I am and the stuff I like to do!" />
         </div>
         <div className="buttonWrapper2">
          <button type="submit" className="welcomeButton" onClick={this.handleClickNext}>
            Finish!
          </button>
          </div>
        </form>
      </div>
      </Animate>)
  }
}

const mapStateToProps = (state) => ({
  picture: state.user.picture.data.url,
  name: state.user.name,
});

export default connect(mapStateToProps)(WelcomeStaging);
