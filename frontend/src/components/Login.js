import React, { Component } from "react";
import { connect } from "react-redux";
import FacebookLogin from "react-facebook-login";

const responseFacebook = response => {
  console.log(response);
};

//This Login Component will render the FB login

class Login extends Component {
  render() {
    return (
      <div>
        LOGIN PAGE<br/>
        <FacebookLogin
          appId="132248777635494"
          autoLoad={true}
          fields="name,email,picture"
        //  onClick={componentClicked}
        //  callback={responseFacebook}
        />
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   //redux props import
// });

export default Login;
