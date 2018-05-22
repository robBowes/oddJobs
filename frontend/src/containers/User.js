import React, {Component} from 'react';
import UserDetails from './../components/UserDetails.js';

class User extends Component {
    componentDidMount=()=>{
        console.log(this.props)
    }
    goBack=()=>{
        window.history.back();
    }
  render() {
    return <div>
        <button className="backButton" onClick={this.goBack}>{'< Back'}</button>
        <UserDetails userid={this.props.id}/>
      </div>;
  }
}

export default User;
