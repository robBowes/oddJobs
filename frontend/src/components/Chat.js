import React, { Component } from "react";
import { connect } from "react-redux";

// //The Chat app that connects patron to helper to discuss
// // job details

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messages: [],
      job: undefined,
      loading: true,
      timestamp: "no stamp yet"
    };
  }
  componentDidUpdate = () => {};
  getAllMsgs = () => {
    fetch("/user", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ id: this.props.user.id })
    })
      .then(x => x.json())
      .then(y => {
        if (!y.status) {
          throw new Error(y.reason);
        }
        this.props.dispatch({
          type: "USER_UPDATE",
          payload: y.user
        });
        return y;
      })
      .then(z => {
        let jobFound = this.findJob(z);
        let chatFound = this.findChat(jobFound);

        let compare = window.location.href.split("/");
        if (
          compare[compare.length - 1] === this.props.userid &&
          compare[compare.length - 2] === this.props.jobid &&
          compare[compare.length - 3] === "chats"
        ) {
            console.log(this.props.user.id===jobFound.patronId)
            let offerCheck = this.props.user.id === jobFound.patronId ? 
            jobFound.dealsOfferedByHelpers.some(x => x === this.props.userid) : 
            jobFound.dealsOfferedByPatron.some(
                    x => {
                        
                      return x === this.props.user.id;
                    }
                  );
            let offerCheck2 = this.props.user.id !== jobFound.patronId ? jobFound.dealsOfferedByHelpers.some(x => x === this.props.user.id) : 
            jobFound.dealsOfferedByPatron.some(
                    x => {
                      return x === this.props.userid;
                    }
                  );   
          this.setState({
            loading: false,
            messages: chatFound ? chatFound.messages : [],
            job: jobFound,
            offered: offerCheck
              ,
            offer:
              offerCheck2,
            deal: jobFound.dealMade
          });
          console.log(this.state)
          this.getAllMsgs();
        }
      });
  };

  componentDidMount = () => {
    if (this.state.loading) {
      this.getPartnerName();
      this.getAllMsgs();
    }
  };

  getPartnerName = () => {
    fetch("/user", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ id: this.props.userid })
    })
      .then(x => x.json())
      .then(y => {
        if (!y.status) {
          throw new Error(y.reason);
        }
        this.setState({ name: this.props.user.name, partnerName: y.user.name });
      });
  };
  componentWillReceiveProps = props => {
    this.setState({
      jobId: this.props.jobid,
      partner: this.props.userid,
      userId: this.props.user.id
    });
  };
  goBack = () => {
    window.history.back();
  };
  handleChange = () => {
    let x = document.getElementById("chatbar").value;
    this.setState({ message: x });
  };
  handleSubmit = e => {
    e.preventDefault();
    let x = {
      id: this.state.job.id,
      message: this.state.message,
      partner: this.state.partner
    };
    fetch("/sendMessage", {
      method: "PUT",
      credentials: "same-origin",
      body: JSON.stringify(x)
    })
      .then(x => x.json())
      .then(y => {
        this.props.dispatch({
          type: "MESSAGE_UPDATE",
          payload: y.user
        });
        let jobFound = this.findJob(y);
        let chatFound = this.findChat(jobFound);
        this.setState({ messages: chatFound.messages });
      })
      .then(() => {
        this.getAllMsgs();
      });
    //this.setState({messages: messages})
    document.getElementById("chatbar").value = "";
  };

  findJob = z => {
    let jobFinder = z.user.jobsListed.filter(x => {
      return x.id === this.state.jobId;
    })[0];
    if (!jobFinder) {
      jobFinder = z.user.pairs.filter(x => {
        return x.id === this.state.jobId;
      })[0];
    }
    return jobFinder;
  };

  findChat = job => {
    let chat = job.messages.filter(x => {
      if (
        x.userId === this.props.user.id &&
        this.props.user.id !== job.patronId
      ) {
        return x;
      }
      if (this.props.user.id === job.patronId) {
        return x.userId === this.state.partner;
      }
    })[0];
    return chat;
  };

  deal = () => {
    fetch("/deal", {
      method: "PUT",
      credentials: "same-origin",
      body: JSON.stringify({
        jobId: this.props.jobid,
        counterParty: this.props.userid
      })
    })
      .then(x => x.json())
      .then(y => {
        console.log(y);
        if (y.status) {
            y.job.dealMade ? this.setState({ deal: true }) : null;
        if(this.props.user.id!==y.job.patronId){
            console.log('test')
          y.job.dealsOfferedByHelpers.some(x=>x===this.props.user.id)
            ? this.setState({
                offer: true
              })
            : null
            this.sendDeal()
        }
          if (this.props.user.id === y.job.patronId) {
            y.job.dealsOfferedByPatron.some(x => x === this.props.user.id) ? this.setState(
                  {
                    offer: true
                  }
                ) : null;
                this.sendDeal()
          }   

        }
      });
  };

  sendDeal=()=>{
      let x = { id: this.state.job.id, message: 

          this.state.offered?"I Accept the Deal! See you soon!":"I would like to offer a Deal! Click the Confirm button to accept the deal.",
       partner: this.state.partner };
      fetch("/sendMessage", {
        method: "PUT",
        credentials: "same-origin",
        body: JSON.stringify(x)
      })
        .then(x => x.json())
        .then(y => {
          this.props.dispatch({
            type: "MESSAGE_UPDATE",
            payload: y.user
          });
          let jobFound = this.findJob(y);
          let chatFound = this.findChat(jobFound);
          this.setState({ messages: chatFound.messages });
        })
        .then(() => {
          this.getAllMsgs();
        });

  }

  renderMessages = () => {
    if (this.state.messages.length > 0) {
      return this.state.messages.map((x, i) => {
        return (
          <li
            className={
              this.props.user.id === x.userId ? "userBubble" : "partnerBubble"
            }
            id={x.id}
            key={i}
          >
            {
              //(x.userId===this.props.user.id?this.state.name:this.state.partnerName) + ": " +
              x.message
            }
          </li>
        );
      });
    }
  };
  render() {
    return this.state.loading ? (
      <div>LOAD</div>
    ) : (
      <div>
        <button onClick={this.goBack}>BACK</button>
        <button>HOME</button>
        <div>
          {this.state.partnerName + ` - "` + this.state.job.jobTitle + `"`}
        </div>
        <div
          style={{ overflowY: "scroll", maxHeight: "82vh" }}
          className="chatWindow"
        >
          <ul style={{ listStyleType: "none" }}>{this.renderMessages()}</ul>
        </div>
        <div
          style={{ bottom: "0vh", position: "absolute" }}
          className="chatInput"
        >
          <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleChange} id="chatbar" />
          </form>
          {this.state.deal?<button>DEAL MADE</button>:this.state.offer ? (
            <button>DEAL SENT</button>
          ) : (
            <button onClick={this.deal}>{this.state.offered?'CONFIRM!':'SEND DEAL'}</button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  jobs: state.data.jobs
});

export default connect(mapStateToProps)(Chat);
