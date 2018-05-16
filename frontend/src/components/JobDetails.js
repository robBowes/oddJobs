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
        this.setState({
          loading: false,
          job: this.props.jobs.filter(x => {
            return x.id === this.props.id
          })[0]
        });
    }
  render() {
      return this.state.loading ? <div>
          <MoonLoader color="#000000" loading={this.state.loading} />
        </div> : <div>
          <br />
          {// this.props.jobs[this.props.id].jobTitle
          this.props.jobs ? this.state.job.jobTitle : null}
          <br />
          <img style={{ maxWidth: "300px" }} src={this.props.jobs ? this.state.job.picture : ""} alt="" />
          <br />
          DESCRIPTION:{//this.props.jobs[this.props.id].jobDescription
          this.props.jobs ? this.state.job.jobDescription : null}
          <br />
          PAY: {//this.props.jobs[this.props.id].jobPay
          this.props.jobs ? "$" + this.state.job.jobPay : "FREE"}
          <br />
          SELLER ID:{//this.props.jobs[this.props.id].patronId
          this.props.jobs ? this.state.job.patronId : null}
          <br />
          {this.props.id}
        </div>;
  }
}

const mapStateToProps = state => ({
    jobs: state.data.jobs
});

export default connect(mapStateToProps)(JobDetails);
