import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MoonLoader} from 'react-spinners';
import {Link} from 'react-router-dom';
import Animate from 'react-smooth';

// The PairsList component will render a given users pairs
// Pairs for jobs posted and jobs applied for will appear in different colors
// selecting a job will show a list of connected helpers to link to Chat app
// if a user selects a job to which they are connected to exactly one other user
// They will be taken directly to the chat
// If a user selects a job to which they are connected to exactly zero other users
// placeholder text/image will appear

class PairsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      loading:true,
    };
  }
  componentDidUpdate=()=>{
    if(this.state.loading===true){
    fetch("/user", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ id: this.props.user.id })
  })
    .then(x => x.json())
    .then(y => {
      if (!y.status){
        return
      }
      else {
        console.log("IN DISPATCH", y);
        this.props.dispatch({ type: "USER_UPDATE", payload: y.user });
      }
    })
  }}
  removeJob = (event) => {
    console.log(event.target.name);
  fetch('rejectJob', {
    method: 'PUT',
    credentials: 'same-origin',
    body: JSON.stringify({id: event.target.name}),
  })
  .then((x) => x.json())
  .then((y) => {
    if (!y.status) throw new Error(y.reason);
    this.props.dispatch({
      type: 'MESSAGE_UPDATE',
      payload: y.user,
    });
    this.setState({loggedIn: false});
  });
  }
  mapListedJobs = () => {
    let listedJobs = [...this.props.user.jobsListed];
    return listedJobs.map((x, i) => {
      return (
        <div className={x.dealMade?'pairedDealCard':'listedJobCard'} key={i+'list'}>
           <button name={x.id} className="removeJob" onClick={this.removeJob}>x</button>
           <Link to={'/job'+x.id}>

           <img className="pairJobPic" src={x.picture} alt="Pair List Job Image"/>

           </Link>
           <Link to={'/chats/'+x.id}>
           <div className='jobDetailsFlexer'>
           <h3 className="jobDetailsHeader">{'$'+x.jobPay + ' - Patron' }</h3>
           <h2 className="jobTitleHeader">{x.jobTitle}<br/>{(x.completedByPatron&&x.completedByHelper)?'(Completed)':x.dealMade?'(In Progress)':'(Pending)'}</h2>
           </div>
        <button name={x.id} className="goToChatsArrow">{'⟩'}</button></Link>
        </div>
      );
    });
  }
  mapPairedJobs =() => {
    let pairedJobs = [...this.props.user.pairs];
    return pairedJobs.map((x, i) => {
      return (
        <div className={x.dealMade?'pairedDealCard':'pairedJobCard'} key={i+'more pairs'}>
           <button name={x.id} className="removeJob" onClick={this.removeJob}>x</button>
            <Link to={'/job'+x.id}>

           <img className="pairJobPic" src={x.picture} alt="Pair List Job Image"/>

           </Link>
           <Link to={'/chats/'+x.id}>
                      <div className='jobDetailsFlexer'>

           <h3 className="jobDetailsHeader">{'$'+x.jobPay + ' - '+Math.floor(x.distance/1000)+'km' }</h3>
           <h2 className="jobTitleHeader">{x.jobTitle}<br/>{(x.completedByPatron&&x.completedByHelper)?'(Completed)':x.dealMade?'(In Progress)':'(Pending)'}</h2>
           </div>
          <button name={x.id} className="goToChatsArrow">{'⟩'}</button></Link>
        </div>
      );
    });
  }
  goBack = (event) => {
    event.preventDefault();
    window.history.back();
  }
  componentDidMount = () => {
    this.setState({loading: false})
   }
componentWillMount=()=>{
  if(this.props.user.id){
    console.log(this.props.user)
  fetch("/user", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ id: this.props.user.id })
  })
    .then(x => x.json())
    .then(y => {
      if (!y.status){
        return
      }
      else {
        console.log("IN DISPATCH", y);
        this.props.dispatch({ type: "USER_UPDATE", payload: y.user });
      }
      this.setState({loading: false})
    })
    
  
  } 
}

  render() {
    return !this.props.user.loggedIn?<div className="moonLoader" ><MoonLoader color="#05FF05"/></div>:(
      <Animate to={"0.99"} from={"0.01"} attributeName="opacity" duration={1000}>
     <div className="pairsPage">  
      <button className="backButton" onClick={this.goBack}>{'❮ Back'}</button>
      <h1 className="pageTitle">{'Current & Pending Jobs'}</h1>
      <div className="split">
         <hr/>
         </div>
      <div style={{overflowY: 'scroll', height: '80vh'}} className="jobsList" >
        {this.mapListedJobs()}
        {this.mapPairedJobs()}
        </div>
      </div> 
      </Animate>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(PairsList);
