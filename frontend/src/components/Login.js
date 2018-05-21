import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {FacebookLogin} from 'react-facebook-login-component';
import FacebookLogin from 'react-facebook-login';


// This Login Component will render the FB login

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      image: null,
      token: null,
      username: null,
    };
  }
  componentWillReceiveProps = (props) => {
    this.setState({
      image: this.props.picture,
      id: this.props.id,
      username: this.props.username,
    });
  };
  getpos = async ()=>{
    let result = await navigator.geolocation.watchPosition((x) => {
      let lat =x.coords.latitude;
      let lng =x.coords.longitude;
      let loc = {lat, lng};
      fetch('/modify', {
        method: 'PUT',
        credentials: 'same-origin',
        body: JSON.stringify({location: loc}),
      }).then((x)=>x.json())
      .then((y)=>{
        if (y.user) {
          this.props.dispatch({
            type: 'USER_UPDATE',
            payload: y.user.location,
          });
        }
      });
    });
  };
  responseFacebook = (response) => {
    this.getpos();
    response.location={};
    console.log(response);
    if (response.id) {
      fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(response),
      })
      .then((x) => x.json())
      .then((y) => {
        console.log(y);
        if (!y.status) {
          // throw new Error('FAILED LOGIN');
        }
        this.props.dispatch({
          type: 'USER_UPDATE',
          payload: y.user,
        });
      });


      this.setState({loading: false});
    }
    // anything else you want to do(save to localStorage)...
  };
  componentWillMount = () =>{
    this.getpos();
  }
  fakeLogin = () => {
    this.getpos();
    fetch('/login', {
      method: 'POST',
      credentials: 'same-origin',
      // headers: JSON.stringify({cookie: 'token=54321'}),
      body: JSON.stringify({}),
    })
    .then((x) => x.json())
    .then((y) => {
      // if (!y.status) {
      //   throw new Error('FAILED LOGIN');
      // }
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user,
      });
    });
    this.setState({loading: false});
  }
  render() {
    return (
      <div>
      <FacebookLogin
      appId="132248777635494"
      language="en_US"
      scope="public_profile,email"
      callback={this.responseFacebook}
      // onClick={this.responseFacebook}
      autoLoad={true}
      xfbml={true}
      fields="id,email,name,picture.type(large)"
      // version="v2.5"
      className="facebook-login"
      buttonText="Login With Facebook"
      redirectUri={window.location.href}
      />
      <button onClick={this.fakeLogin}>Fake Login</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // redux props import
  picture: state.user.picture,
  username: state.user.username,
  id: state.user.id,
});

export default connect(mapStateToProps)(Login);
