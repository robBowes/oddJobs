import React, { Component } from "react";
import { connect } from "react-redux";

//The Chat app that connects patron to helper to discuss
// job details

class Chat extends Component{
    constructor(props){
        super(props);
        this.state={
            message: '',
            messages: [],
            job: undefined,
            loading: true
        }
    }
    componentDidUpdate=()=>{
        
    }
    componentDidMount=()=>{
        if(this.state.loading){
         fetch('/user',{
             method:'POST',
             credentials: 'same-origin',
             body: JSON.stringify({userId: this.props.user.id})
         })
         .then(x=>x.json())
         .then(y=>{
             console.log(y)
             this.props.dispatch({
                 type: 'USER_UPDATE',
                 payload: y.user
             })
             return y
         })
         .then(z=>{
             console.log(z)
            this.setState({
              loading: false,
              messages: z.user.jobsListed[0].messages[0]
                .messages,
              job: z.user.jobsListed[0]
            });
         })}
    }
    componentWillReceiveProps=(props)=>{
        if(!this.state.job && !this.state.userId){
        this.setState({job: props.user.jobsListed[0], userId: props.user.id})}
    }
    goBack=()=>{
        window.history.back()
    }
    handleChange=()=>{
        let x = document.getElementById('chatbar').value
        this.setState({message: x})
    }
    handleSubmit=e=>{
        e.preventDefault();
        let x = {id: this.state.job.id, message: this.state.message}
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
            
            this.setState({messages:y.user.jobsListed[0].messages[0].messages})
        })
        .then(()=>{
        })
        //this.setState({messages: messages})
        document.getElementById('chatbar').value=''
    }
    
    renderMessages=()=>{
        return this.state.messages.map((x,i)=>{
            return <li id={x.id} key={i}>{x.userId+': '+x.message}</li>
        })
    }
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
 user: state.user
});

export default connect(mapStateToProps)(Chat)   