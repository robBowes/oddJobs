import React, {Component} from 'react';
import UserDetails from './../components/UserDetails.js';

class User extends Component {
    goBack=()=>{
        window.history.back();
    }
  render() {
    return <div>
        <button className="backButton" onClick={this.goBack}>{'< Back'}</button>
        <UserDetails />
      </div>;
  }
}

export default User;
