import React, {Component} from 'react';
import './App.css';
import Landing from './containers/Landing';
import Pairs from './containers/Pairs';
import Settings from './containers/Settings';
import Swipe from './containers/Swipe';
import Welcome from './containers/Welcome';
import {BrowserRouter, Link, Route} from 'react-router-dom'
import {connect} from 'react-redux'
import WelcomeStaging from './components/WelcomeStaging';
import WelcomeStaging2 from './components/WelcomeStaging2';


class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      loggedIn: false,
      welcomeStage: 0,
    }
  }
  componentWillReceiveProps = props =>{
    this.setState({loggedIn: this.props.loggedIn})
  }
  componentWillMount = () => {
    let cookie = document.cookie;
    let hasToken = cookie.search('token')!==-1;
    if(hasToken) {
    fetch('/login', {
      method: 'POST',
      credentials: 'same-origin',
    })
    .then(x => x.json())
    .then(y => {
      if(y.status){
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user
      })}
      else {
        this.props.dispatch({
          type: 'USER_INFO',
          loggedIn: false,
        })
      }
    })
    }
  

    console.log(cookie)

  }
  render() {
    return (
      <BrowserRouter>
      <div className="App">
      {!this.props.loggedIn?<Landing/>:<Swipe/>}
      <Settings style={{'display':this.state.currentPage==='settings'?'block':'none'}}/>
      <Route exact={true} path='/settings' render={this.renderSettings}/>
      
       {this.props.loggedIn?(this.props.welcomeStage===0?<WelcomeStaging/>:''):''}
       {this.props.loggedIn?(this.props.welcomeStage===1?<WelcomeStaging2/>:''):''}  
  

      </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  example: state.example,
  loggedIn: state.user.loggedIn,
  welcomeStage: state.user.welcomeStage,
});

export default connect(mapStateToProps)(App);
