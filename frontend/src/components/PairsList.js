import React, { Component } from "react";
import { connect } from "react-redux";
import { MoonLoader } from "react-spinners"

//The PairsList component will render a given users pairs
//Pairs for jobs posted and jobs applied for will appear in different colors
//selecting a job will show a list of connected helpers to link to Chat app
//if a user selects a job to which they are connected to exactly one other user
//They will be taken directly to the chat
//If a user selects a job to which they are connected to exactly zero other users
//placeholder text/image will appear

class PairsList extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }
  removeJob = (event) => {

  }
  goToChats = (event) => {

  }
  mapListedJobs = () => {
    let listedJobs = [...this.props.user.jobsListed]
    console.log(listedJobs)
    return listedJobs.map(x => {
      return (
        <div className="listedJobCard">
           <button name={x.id} className="removeJob" onClick={this.removeJob}>x</button> 
           <h3 className="jobDetailsHeader">{"$"+x.jobPay + " - Patron" }</h3>
           <h2 className="jobTitleHeader">{x.jobTitle+"\n"}{x.dealMade?"(In Progress)":"(Pending)"}}</h2>
           <button name={x.id} className="goToChatsArrow" onClick={this.goToChats}>></button>
        </div>
      )
    })
  }
  render() {
    return !this.props.user.loggedIn?<div><MoonLoader color="#05FF05"/></div>:(
      <div className="pairsPage">
        {this.mapListedJobs()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(PairsList);
