import React, { Component } from "react";
import { connect } from "react-redux";

// //The Chat app that connects patron to helper to discuss
// // job details

class Chat extends Component{
    constructor(props){
        super(props);
        this.state={
            message: '',
            messages: [],
            job: undefined,
            loading: true,
            timestamp: 'no stamp yet'
            
        }
        
    }
    componentDidUpdate=()=>{
    }
    componentDidMount=()=>{
        if(this.state.loading){
        setInterval(()=>{    
         fetch('/user',{
             method:'POST',
             credentials: 'same-origin',
             body: JSON.stringify({id: this.props.user.id})
         })
         .then(x=>x.json())
         .then(y=>{
             if(!y.status){
                 throw new Error(y.reason)
             }
             this.props.dispatch({
                 type: 'USER_UPDATE',
                 payload: y.user
             })
             return y
         })
         .then(z=>{
            let jobFound = this.findJob(z)
            let chatFound = this.findChat(jobFound)
            this.setState({
              loading: false,
              messages: chatFound?chatFound.messages:[],
              job: jobFound
            });
         }
        )}, 500)
    }

    }
    componentWillReceiveProps=(props)=>{
        this.setState({jobId: this.props.jobid, partner: this.props.userid, userId: this.props.user.id})
        
    }
    goBack=()=>{
        window.history.back();
        
    }
    handleChange=()=>{
        let x = document.getElementById('chatbar').value
        this.setState({message: x})
    }
    handleSubmit=e=>{
        e.preventDefault();
        let x = {id: this.state.job.id, message: this.state.message, partner: this.state.partner}
        console.log(x)
        fetch('/sendMessage',{
            method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify(x)
        })
        .then(x=>x.json())
        .then(y=>{
            this.props.dispatch({
                type: 'MESSAGE_UPDATE',
                payload: y.user
            })
            let jobFound = this.findJob(y)
            console.log(jobFound)
            let chatFound = this.findChat(jobFound)
            console.log(chatFound)
            this.setState({messages:chatFound.messages})
        })
        .then(()=>{
        })
        //this.setState({messages: messages})
        document.getElementById('chatbar').value=''
    }

    findJob=(z)=>{
       let jobFinder = z.user.jobsListed.filter(x => {
         return x.id === this.state.jobId;
       })[0];
       if (!jobFinder) {
         jobFinder = z.user.pairs.filter(x => {
           return x.id === this.state.jobId;
         })[0];
       }
       return jobFinder
    }

    findChat=(job)=>{
        let chat = job.messages.filter(x => {
          if (x.userId === this.props.user.id && this.props.user.id !== job.patronId) {
            return x;
          }
          if (this.props.user.id === job.patronId) {
            return x.userId === this.state.partner;
          }
        })[0];
        return chat
    }
    
    renderMessages=()=>{
        if(this.state.messages.length>0){
        return this.state.messages.map((x,i)=>{
            return <li id={x.id} key={i}>{x.userId+': '+x.message}</li>
        })
    }}
    render(){
    return this.state.loading?
    <div>LOAD</div>:<div>
        <button onClick={this.goBack}>BACK</button>
        <button>HOME</button>
        <div style={{overflowY: 'scroll'}} className="chatWindow">
          <ul>{this.renderMessages()}</ul>
        </div>
        <div style={{ bottom: "0vh", position: "absolute" }}  className="chatInput">
          <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleChange} id='chatbar'/>
          </form>
        </div>
      </div>;

    }
}

const mapStateToProps = state =>({
 user: state.user,
 jobs: state.data.jobs
});

export default connect(mapStateToProps)(Chat)   