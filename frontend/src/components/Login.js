import React, { Component } from "react";
import { connect } from "react-redux";
import {FacebookLogin} from "react-facebook-login-component";

const responseFacebook = response => {
  console.log(response);
};

//This Login Component will render the FB login

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
        image: null,
        token: null,
        username: null
    }
  }
  componentWillReceiveProps = props => {
      this.setState({
          image: this.props.picture,
          token: this.props.token,
          username: this.props.username
              })
  }
  responseFacebook=(response)=> {
    console.log(response);
    this.props.dispatch({
        type: 'USER_INFO', picture: response.picture.data.url, 
        token: response.accessToken,
        username:response.name})
    this.setState({loading: false})

    //anything else you want to do(save to localStorage)...
  }

  render() {
    return (
      <div>
        <FacebookLogin
          socialId="132248777635494"
          language="en_US"
          scope="public_profile,email"
          responseHandler={this.responseFacebook}
          xfbml={true}
          fields="id,email,name,picture.type(large)"
          version="v2.5"
          className="facebook-login"
          buttonText="Login With Facebook"
        />
        {this.props.username}
        <img width='300px' height='300px' src={this.props.picture}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //redux props import
  picture: state.user.picture,
  username: state.user.username,
  token: state.user.token
});

export default connect(mapStateToProps)(Login);
