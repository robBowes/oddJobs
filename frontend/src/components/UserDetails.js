import React, { Component } from "react";
import { connect } from "react-redux";
import {MoonLoader} from 'react-spinners'

//This component renders the details for a given user
//When viewing user details page
//pic, description, statistics

class UserDetails extends Component {
    constructor(props){
        super(props);
        this.state ={
            loading: true
        }
    }
    componentDidMount=()=>{
        this.setState({loading: false})
    }
  render() {
      return this.state.loading === true ? <div>
          <MoonLoader color="#05ff05" loading={this.state.loading} />
        </div> : <div className="welcomeStage2">
        <div className="userPictureContainer">

          <img className="userPicture" src={this.props.user.picture ? this.props.user.picture.data.url : "loading image"} alt="" />
          </div>
          <h2 className="welcomeName">{this.props.user.name}</h2>

       <div className="descriptionDetailsWrapper">
          {this.props.user.description}
</div>

          <div className="userRating">
          User Score -  <span className = "score">99</span>
          </div>
        </div>;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(UserDetails);
