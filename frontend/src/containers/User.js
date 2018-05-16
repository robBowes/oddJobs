import React, { Component } from "react";
import UserDetails from './../components/UserDetails.js'

class User extends Component {
    goBack=()=>{
        window.history.back();
    }
  render() {
    return <div>
        <button onClick={this.goBack}>back</button>
        <UserDetails />
      </div>;
  }
}

export default User;
