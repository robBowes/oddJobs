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
    componentDidMount=()=>{
        this.setState({loading:false})
    }
  render() {
      return this.state.loading?
     <div>
    <MoonLoader 
     color='#000000'
      loading={this.state.loading}
     />
      </div>
      :
      <div>
          test
          <br />
          {
             // this.props.jobs[this.props.id].jobTitle
                this.props.jobs.jobTitle
              }
          <br />
          <img src="http://unsplash.it/220/220" />
          <br />
          DESCRIPTION:{
              //this.props.jobs[this.props.id].jobDescription
              this.props.jobs.jobDescription
              }
          <br />
          PAY: {
              //this.props.jobs[this.props.id].jobPay
            this.props.jobs.jobPay
        }
          <br />
          SELLER ID:{
              //this.props.jobs[this.props.id].patronId
            this.props.jobs.patronId
            }
          <br />
          {this.props.id}
        </div>;
  }
}

const mapStateToProps = state => ({
    jobs: state.data.jobs
});

export default connect(mapStateToProps)(JobDetails);
