import React, { Component } from "react";
import { connect } from "react-redux";
import { MoonLoader } from "react-spinners";

//This component renders the details for a given job
//When viewing job details page
//pic, description, pertinent info

class JobDetails extends Component {
    constructor(props){
        super(props);
        this.state={
            loading: true
        }
    }
    componentWillReceiveProps=props=>{
        console.log(props)
    }
    componentDidMount=()=>{
        let job = this.props.jobs.filter(x => {
            return x.id === this.props.id
          })[0]
          console.log(job)
        fetch('/user',{
            method:'POST',
            credentials: 'same-origin',
            body: JSON.stringify({id: job.patronId })
        })
        .then(x=>x.json())
        .then(y=>{
            console.log(y)
        this.setState({
          loading: false,
          job: job,
          patron: y.user
        })})

    }
  render() {
      return this.state.loading ? <div>
          <MoonLoader color="#000000" loading={this.state.loading} />
        </div> : <div>
            <div>
          <div className="pageTitle">
            {this.props.jobs ? this.state.job.jobTitle + " - " + "$" + this.state.job.jobPay : null}
            </div>
            <br />
          </div>
          <div className="userPictureContainer">
            <img className="jobPicture" src={this.props.jobs ? this.state.job.picture : ""} alt="" />
            <br />
          </div>
          <div className="patronBar">
            <img className="jobDetailsPatronPicture" src={this.state.patron.picture.data.url} />
            <div className="welcomeName">{this.state.patron.name} </div>
          </div>
          <div className="jobDescriptionDetailsWrapper">
          
          Details:
          <br/>{this.props.jobs ? this.state.job.jobDescription : null}
          <br />
          <br />
          <br />
          <div className='smallTextId'>
          {this.props.id}</div>
          </div>
        </div>;
  }
}

const mapStateToProps = state => ({
    jobs: state.data.jobs
});

export default connect(mapStateToProps)(JobDetails);
