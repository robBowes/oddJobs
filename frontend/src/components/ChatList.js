import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MoonLoader} from 'react-spinners';
import _ from 'lodash'

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: ''
    };
  }
  removeChat = (event) => {

  }
  renderCard = (x) => {
      return (
        <div className="ChatCard">
           <button name={x.id} className="removeChat" onClick={this.removeChat}>x</button> 
           <img height="100px" width="100px" className="pairJobPic" src={x.picture.data.url} alt="Pair List Job Image"/>
           <h2 className="chatTitleHeader">{x.name}</h2>
           <button name={x.id} className="goToChatsArrow">{">"}</button>
        </div>
      );
  }
  mapListedChats = () => {
    let userJobs = [...this.props.user.jobsListed];
    let job = userJobs.find(x => x.id === this.props.id)
    if (!job) {
      let helperJobs = [...this.props.user.pairs] 
      let job = helperJobs.find(x => x.id === this.props.id)
      return (
        <div className="ChatCard">
           <button name={job.patronId} className="removeChat" onClick={this.removeChat}>x</button> 
           <img height="100px" width="100px" className="chatUserPic" src={job.patron.picture.data.url} alt="Chat List User Image"/>
           <h2 className="chatTitleHeader">{job.patron.name}</h2>
           <button name={job.patronId} className="goToChatsArrow">{">"}</button>
        </div>
      );    }
    let pairedHelpers = job.pairedHelpers
    return pairedHelpers.map((x) => {
      return (
        <div className="ChatCard">
           <button name={x.id} className="removeChat" onClick={this.removeChat}>x</button> 
           <img height="100px" width="100px" className="chatUserPic" src={x.picture.data.url} alt="Chat List User Image"/>
           <h2 className="chatTitleHeader">{x.name}</h2>
           <button name={x.id} className="goToChatsArrow">{">"}</button>
        </div>
      );
    });
  }
  getTitle = () => {
    let userJobs = [...this.props.user.jobsListed];
    let job = userJobs.find(x => x.id === this.props.id)
    if (job) {
    return job.jobTitle
    }
    else {
      let helperJobs = [...this.props.user.pairs] 
      let job = helperJobs.find(x => x.id === this.props.id)
      return job.jobTitle
    }
  }
  goBack = (event) => {
    event.preventDefault();
    window.history.back();
  }
  componentWillMount = () => {

  }
  render() {
    return !this.props.user.loggedIn?<div><MoonLoader color="#05FF05"/></div>:(
      <div className="chatsPage">
      <button className="backButton" onClick={this.goBack}>Back</button>
      <h1 className="chatsPageHeader">{this.getTitle()+' - Active Chats'}</h1>
      <div style={{overflowY: 'scroll', height: '80vh'}} className="chatsList" >
        {this.mapListedChats()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ChatList);
