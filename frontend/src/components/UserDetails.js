import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MoonLoader} from 'react-spinners';

// This component renders the details for a given user
// When viewing user details page
// pic, description, statistics

class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.state ={
            loading: true,
            score: 100,
        };
    }
    componentDidMount=()=>{
        console.log(this.props);
        fetch('/user', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({id: this.props.userid}),
        })
        .then((x)=>x.json())
        .then((y)=>{
        if (!y.status) console.log(y);
        this.setState({loading: false, user: y.user});
        this.props.dispatch({type: 'TOGGLE_LOADING'});
        this.calcScore();
        });
    }
    calcScore = () => {
        if (!this.state.user.statistics.jobsCompleted) return 100;
        this.state.user.statistics.jobsCompleted;
        let jobsComplete = this.state.user.statistics.jobsCompleted;
        let jobsDeclined = this.state.user.statistics.jobsCanceled;
        let totalJobs = jobsComplete+jobsDeclined;
        if (totalJobs === 0) return 100;
        else this.setState({ score: Math.floor((jobsComplete/totalJobs)*100)})
    }
    componentWillMount = () => {
        this.props.dispatch({type: 'TOGGLE_LOADING'});
    }
  render() {
      return this.state.loading?<div/>:<div className="welcomeStage2">
          <div className="userDetailsDivider" />
          <div className="userPictureContainer">
            <img className="userPicture" src={this.state.user ? this.state.user.picture.data.url : 'loading image'} alt="" />
          </div>
          <h2 className="welcomeName">{this.state.user?this.state.user.name:''}</h2>

          <div className="descriptionDetailsWrapper">
            {this.state.user?this.state.user.description:''}
          </div>

          <div className="userRating">
            User Score - <span className="score">
              {this.state.score + '%'}
            </span>
          </div>

          <div className="userRating1">
            Jobs Completed - <span className="score">
              {this.state.user.statistics.jobsCompleted}
            </span>
            <br />
            Jobs Abandoned - <span className="score">
              {this.state.user.statistics.jobsCanceled}
            </span>
            <br />
          </div>
        </div>;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(UserDetails);
