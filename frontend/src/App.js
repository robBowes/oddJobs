import React, {Component} from 'react';
import './App.css';
import Landing from './containers/Landing';
import Pairs from './containers/Pairs';
import Settings from './containers/Settings';
import Swipe from './containers/Swipe';
import Welcome from './containers/Welcome';

class App extends Component {
  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  example: state.example,
});

export default App;
