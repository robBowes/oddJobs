import React, { Component } from "react";
import JobDetails from './../components/JobDetails.js'

//This container will hold the JobDetails component

class Job extends Component {
    goBack=()=>{
        window.history.back()
    }
  render() {
      return (
            <div>
                <button onClick={this.goBack}>back</button>
                <JobDetails id={this.props.id}/>
                
            </div>
      )
  }
}


export default Job
