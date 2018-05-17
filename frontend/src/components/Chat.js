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
            job: ''
        }
    }
    componentDidMount=()=>{
        // fetch('/user',{
        //     method:'',
        //     credentials: 'same-origin',
        //     body: JSON.stringify
        // })
    }
    componentWillReceiveProps=(props)=>{
        if(!this.state.job){
        this.setState({job: props.user.jobsListed[0]})}
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
            console.log(y)
            this.props.dispatch({
                type: 'USER_UPDATE',
                jobsListed: y.user
            })
            
            this.setState({messages:y.user.jobsListed[0].messages[1].messages})
        })
        .then(()=>{
        })
        //this.setState({messages: messages})
        document.getElementById('chatbar').value=''
    }
    componentDidUpdate=()=>{

    }
    renderMessages=()=>{
        return this.state.messages.map((x,i)=>{
            return <li id={x.id} key={i}>{x.userId+': '+x.message}</li>
        })
    }
    render(){
    return !this.state.job.id?
    <div>LOAD</div>:<div>
        <button onClick={this.goBack}>BACK</button>
        <button>HOME</button>
        <div className="chatWindow">
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