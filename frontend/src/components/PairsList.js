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
           <h2 className="jobTitleHeader">{x.jobTitle}<br/>{x.dealMade?"(In Progress)":"(Pending)"}</h2>
           <button name={x.id} className="goToChatsArrow" onClick={this.goToChats}>{">"}</button>
        </div>
      )
    })
  }
  mapPairedJobs =() => {
    let pairedJobs = [...this.props.user.pairs]
    console.log(pairedJobs)
    return pairedJobs.map(x => {
      return (
        <div className="pairedJobCard">
           <button name={x.id} className="removeJob" onClick={this.removeJob}>x</button> 
           <h3 className="jobDetailsHeader">{"$"+x.jobPay + " - Helper" }</h3>
           <h2 className="jobTitleHeader">{x.jobTitle}<br/>{x.dealMade?"(In Progress)":"(Pending)"}</h2>
           <button name={x.id} className="goToChatsArrow" onClick={this.goToChats}>{">"}</button>
        </div>
      )
    })
  }
  goBack = (event) => {
    event.preventDefault()
    window.history.back();
  }
  render() {
    return !this.props.user.loggedIn?<div><MoonLoader color="#05FF05"/></div>:(
      <div className="pairsPage">
      <button className="backButton" onClick={this.goBack}>Back</button>
      <h1 className="pairsPageHeader">{"Current & Pending Jobs"}</h1>
        {this.mapListedJobs()}
        {this.mapPairedJobs()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(PairsList);
