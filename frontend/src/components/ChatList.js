import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MoonLoader} from 'react-spinners';
import {Link} from 'react-router-dom';

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: '',
    };
  }
  removeChat = (event) => {

  }
  mapListedChats = () => {
    let userJobs = [...this.props.user.jobsListed];
    let job = userJobs.find((x) => x.id === this.props.id);
    if (!job) {
      let helperJobs = [...this.props.user.pairs];
      let job = helperJobs.find((x) => x.id === this.props.id);
      console.log('1', job)
      return (
        <div className="ChatCard">
           <button name={job.patronId} className="removeChat" onClick={this.removeChat}>x</button>
           <img height="100px" width="100px" className="chatUserPic" src={''} alt="Chat List User Image"/>
           <h2 className="chatTitleHeader">{'test'}</h2>
           <Link to={'/chats/'+this.props.id+'/'+job.patronId}> <button name={job.patronId} className="goToChatsArrow">{'>'}</button></Link>
        </div>
      );
}
    let pairedHelpers = job.pairedHelpers;
    return pairedHelpers.map((x) => {
      return (
        <div className="ChatCard">
           <button name={x.id} className="removeChat" onClick={this.removeChat}>x</button>
           <img height="100px" width="100px" className="chatUserPic" src={x.picture.data.url} alt="Chat List User Image"/>
           <h2 className="chatTitleHeader">{x.name}</h2>
          <Link to={'/chats/'+this.props.id+'/'+x.id}> <button name={x.id} className="goToChatsArrow">{'>'}</button></Link>
        </div>
      );
    });
  }
  getTitle = () => {
    let userJobs = [...this.props.user.jobsListed];
    let job = userJobs.find((x) => x.id === this.props.id);
    if (job) {
    return job.jobTitle;
    } else {
      let helperJobs = [...this.props.user.pairs];
      let job = helperJobs.find((x) => x.id === this.props.id);
      console.log("2", job);
      return job.jobTitle;
    }
  }
  goBack = (event) => {
    event.preventDefault();
    window.history.back();
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
