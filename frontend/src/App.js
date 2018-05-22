import React, {Component} from 'react';
import './App.css';
import Landing from './containers/Landing';
import Pairs from './containers/Pairs';
import Settings from './containers/Settings.js';
import Swipe from './containers/Swipe';
import Welcome from './containers/Welcome';
import Job from './containers/Job';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import WelcomeStaging from './components/WelcomeStaging';
import WelcomeStaging2 from './components/WelcomeStaging2';
import User from './containers/User.js';
import WelcomeStaging3 from './components/WelcomeStaging3';
import NewJob from './components/NewJob';
import ChatList from './components/ChatList.js';
import Chat from './components/Chat';
import {MoonLoader} from 'react-spinners';


class App extends Component {
  constructor(props) {
    super(props);
    this.state ={
      loggedIn: false,
      welcomeStage: 0,
    };
  }
  componentWillReceiveProps = (props) =>{
    this.setState({loggedIn: this.props.loggedIn});
  }
  componentWillMount = () => {
    let cookie = document.cookie;
    let hasToken = cookie.search('token')!==-1;
    if (hasToken) {
    fetch('/login', {
      method: 'POST',
      credentials: 'same-origin',
    })
    .then((x) => x.json())
    .then((y) => {
      if (y.status) {
        console.log(y.user);
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user,
      });
} else {
        this.props.dispatch({
          type: 'USER_INFO',
          loggedIn: false,
        });
      }
    });
    }
  }
  renderUserDetails=(x)=>{
    return <User id={x.match.params.id}/>;
  }
  resetWelcome = () => {
    this.props.dispatch({
    type: 'WELCOME_STATE',
    payload: 0,
    });
  }
  renderNewJob = () => {
    return (<NewJob/>);
  }
  renderHome = () => {
    return (<div>

  {this.props.loggedIn?(this.props.welcomeStage===3?<Swipe/>:''):<Landing/>}
  </div>);
  }
  renderJobDetails =(x)=>{
    return <Job id={x.match.params.id}/>;
  }
  renderSettings = () => {
    return <Settings/>;
  }
  renderPairsList = () => {
    return <Pairs/>;
  }
  renderChatList = (x) => {
    return <ChatList id={x.match.params.id}/>;
  }
  renderChat = (x) =>{
    return <Chat jobid={x.match.params.jobid} userid={x.match.params.userid} />;
  }
  componentDidMount = () => {
    this.props.dispatch({type: 'TOGGLE_LOADING'});
  }
  render() {
    return (
      <BrowserRouter>
      <div className="App">
      <div className='moonLoader' style={{zIndex: this.props.moonLoader?'10':'-10'}} >
        <MoonLoader color="#05ff05" loading={this.props.moonLoader} />
      </div>
      {/* <button onClick={this.resetWelcome}> Reset Welcome </button>   */}
      <Route exact={true} path='/chats/:jobid/:userid' render={this.renderChat} />
      <Route exact={true} path='/' render={this.renderHome}/>
      <Route exact={true} path='/listjob' render={this.renderNewJob}/>
      <Route exact={true} path='/settings' render={this.renderSettings}/>
      <Route exact={true} path="/user:id" render={this.renderUserDetails} />
      <Route exact={true} path="/job:id" render={this.renderJobDetails} />
      <Route exact={true} path="/currentjobs" render={this.renderPairsList} />
      <Route exact={true} path="/chats/:id" render={this.renderChatList} />
      <Route exact={false} path='/?code*' render={({history})=>{
        return (
          <div>
          {history.push('/')}
          </div>
        );
        }}/>
       {this.props.loggedIn?(this.props.welcomeStage===0?<WelcomeStaging/>:''):''}
       {this.props.loggedIn?(this.props.welcomeStage===1?<WelcomeStaging2/>:''):''}
       {this.props.loggedIn?(this.props.welcomeStage===2?<WelcomeStaging3/>:''):''}
      </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  example: state.example,
  loggedIn: state.user.loggedIn,
  welcomeStage: state.user.welcomeStage,
  moonLoader: state.data.loading,
});

export default connect(mapStateToProps)(App);
