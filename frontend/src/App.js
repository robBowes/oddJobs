import React, {Component} from 'react';
import './App.css';
import Landing from './containers/Landing';
import Pairs from './containers/Pairs';
import Settings from './containers/Settings';
import Swipe from './containers/Swipe';
import Welcome from './containers/Welcome';
import {BrowserRouter, Link, Route} from 'react-router-dom'
import {connect} from 'react-redux'

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      loggedIn: false
    }
  }
  componentWillReceiveProps = props =>{
    this.setState({loggedIn: this.props.loggedIn})
  }
  render() {
    return (
      <BrowserRouter>
      <div className="App">
      {!this.props.loggedIn?<Landing/>:<Swipe/>}
      <Settings style={{'display':this.state.currentPage==='settings'?'block':'none'}}/>
      <Route exact={true} path='/settings' render={this.renderSettings}/>
      
      </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  example: state.example,
  loggedIn: state.user.loggedIn
});

export default connect(mapStateToProps)(App);
