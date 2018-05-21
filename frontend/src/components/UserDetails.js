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
    calcScore = () => {
        if(!!this.props.user.jobsCompleted) return 100
        console.log(this.props.jobsComplete)
        let jobsComplete = this.props.user.jobsCompleted.length;
        let jobsDeclined = this.props.user.jobsDeclined;
        let totalJobs = jobsComplete+jobsDeclined
        if (totalJobs === 0) return 100
        else return Math.floor((jobsComplete/totalJobs)*100)
    }

  render() {
      return this.state.loading === true ? <div>
          <MoonLoader color="#05ff05" loading={this.state.loading} />
        </div> : <div className="welcomeStage2">
        <div className="userDetailsDivider"></div>
        <div className="userPictureContainer">
          <img className="userPicture" src={this.props.user.picture ? this.props.user.picture.data.url : "loading image"} alt="" />
          </div>
          <h2 className="welcomeName">{this.props.user.name}</h2>

       <div className="descriptionDetailsWrapper">
          {this.props.user.description}
</div>
           
          <div className="userRating">
          User Score -  <span className = "score">{this.calcScore()+"%"}</span>
          </div>

          <div className = "userRating1"> 
          Jobs Completed -  <span className = "score">{this.props.user.jobsCompleted.length}</span><br/>
          Jobs Abandoned -  <span className = "score">{this.props.user.jobsDeclined.length}</span><br/>
          </div>

        </div>;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(UserDetails);
