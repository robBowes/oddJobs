import React, {Component} from 'react';
import {connect} from 'react-redux';
import Animate from 'react-smooth';

// //The Chat app that connects patron to helper to discuss
// // job details

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      job: undefined,
      loading: true,
      timestamp: 'no stamp yet',
    };
    this.isPatron = props.user.jobsListed.some((job)=>job.id===props.jobid);
  }
  componentDidUpdate = () => {};
  getAllMsgs = () => {
    fetch('/user', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: this.props.user.id}),
    })
      .then((x) => x.json())
      .then((y) => {
        if (!y.status) {
          throw new Error(y.reason);
        }
        this.props.dispatch({
          type: 'USER_UPDATE',
          payload: y.user,
        });
        return y;
      })
      .then((z) => {
        let jobFound = this.findJob(z);
        let chatFound = this.findChat(jobFound);

        let compare = window.location.href.split('/');
        if (
          compare[compare.length - 1] === this.props.userid &&
          compare[compare.length - 2] === this.props.jobid &&
          compare[compare.length - 3] === 'chats'
        ) {
            let offerCheck = this.props.user.id === jobFound.patronId ?
            jobFound.dealsOfferedByHelpers.some((x) => x === this.props.userid) :
            jobFound.dealsOfferedByPatron.some(
                    (x) => {
                      return x === this.props.user.id;
                    }
                  );
            let offerCheck2 = this.props.user.id !== jobFound.patronId ? jobFound.dealsOfferedByHelpers.some((x) => x === this.props.user.id) :
            jobFound.dealsOfferedByPatron.some(
                    (x) => {
                      return x === this.props.userid;
                    }
                  );
          let oldmsg = [...this.state.messages];
          this.setState({
            complete:
              jobFound.completedByHelper &&
              jobFound.completedByPatron,
            loading: false,
            messages: chatFound ? chatFound.messages : [],
            job: jobFound,
            offered: offerCheck,
            completeSend: this.props.user.id !== jobFound.patronId ? 
              jobFound.completedByHelper : jobFound.completedByPatron,
            offer: offerCheck2,
            deal: jobFound.dealMade
          });
          if (chatFound) {
          if (chatFound.messages>oldmsg) {
            this.updateScroll();
          }
}
          setTimeout(this.getAllMsgs, 1000);
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
    fetch('/user', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: this.props.userid}),
    })
      .then((x) => x.json())
      .then((y) => {
        if (!y.status) {
          throw new Error(y.reason);
        }
        this.setState({name: this.props.user.name, partnerName: y.user.name});
      });
  };
  componentWillReceiveProps = (props) => {
    this.setState({
      jobId: this.props.jobid,
      partner: this.props.userid,
      userId: this.props.user.id,
    });
  };
  goBack = () => {
    window.history.back();
  };
  handleChange = () => {
    let x = document.getElementById('chatbar').value;
    this.setState({message: x});
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let x = {
      id: this.state.job.id,
      message: this.state.message,
      partner: this.state.partner,
    };
    fetch('/sendMessage', {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify(x),
    })
      .then((x) => x.json())
      .then((y) => {
        this.props.dispatch({
          type: 'MESSAGE_UPDATE',
          payload: y.user,
        });
        let jobFound = this.findJob(y);
        let chatFound = this.findChat(jobFound);
        this.setState({messages: chatFound.messages});
      })
      .then(() => {
        this.getAllMsgs();
        this.updateScroll();
      });
    // this.setState({messages: messages})
    this.refs.chat.blur();
    document.getElementById('chatbar').value = '';
  };

  findJob = (z) => {
    let jobFinder = z.user.jobsListed.filter((x) => {
      return x.id === this.state.jobId;
    })[0];
    if (!jobFinder) {
      jobFinder = z.user.pairs.filter((x) => {
        return x.id === this.state.jobId;
      })[0];
    }
    return jobFinder;
  };

  findChat = (job) => {
    let chat = job.messages.filter((x) => {
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
    fetch('/deal', {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        jobId: this.props.jobid,
        counterParty: this.props.userid,
      }),
    })
      .then((x) => x.json())
      .then((y) => {
        if (!y.status) console.log(y);
        if (y.status) {
            y.job.dealMade ? this.setState({deal: true}) : null;
        if (this.props.user.id!==y.job.patronId) {
          y.job.dealsOfferedByHelpers.some((x)=>x===this.props.user.id)
            ? this.setState({
                offer: true,
              })
            : null;
            this.sendDeal();
        }
          if (this.props.user.id === y.job.patronId) {
            y.job.dealsOfferedByPatron.some((x) => x === this.props.user.id) ? this.setState(
                  {
                    offer: true,
                  }
                ) : null;
                this.sendDeal();
          }
        }
      });
  };

  sendDeal=()=>{
      let x = {id: this.state.job.id, message:

          this.state.offered?'Amazing! Your job is now in progress. Make sure to come back later and mark complete to get credit':this.props.user.name + ' has offered you the job! Click Accept up top to commit.',
       partner: this.state.partner};
      fetch('/sendMessage', {
        method: 'PUT',
        credentials: 'same-origin',
        body: JSON.stringify(x),
      })
        .then((x) => x.json())
        .then((y) => {
          this.props.dispatch({
            type: 'MESSAGE_UPDATE',
            payload: y.user,
          });
          let jobFound = this.findJob(y);
          let chatFound = this.findChat(jobFound);
          this.setState({messages: chatFound.messages});
        })
        .then(() => {
          this.getAllMsgs();
        });
  }

  completeJob=()=>{
      let x = {id: this.state.job.id, message: (this.state.job.completedByHelper||this.state.job.completedByPatron)?'Awesome! The job is now complete!':this.props.user.name + ' has marked the job complete. Confirm by clicking the button above!', partner: this.state.partner};
      fetch('/sendMessage', {
        method: 'PUT',
        credentials: 'same-origin',
        body: JSON.stringify(x),
      })
      .then((x)=>{
      if (this.state.job.completedByHelper && this.state.job.completedByPatron) {
        this.setState({complete: true});
      }
      else{
        this.setState({completeSend: true})
      }
      })
      .then((y)=>{
        fetch('/completeJob', {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({jobId: this.props.jobid}),
    })
    .then((z)=>z.json());
  });
  }

  renderMessages = () => {
    let oldmsg = this.state.messages;
    if (this.state.messages.length > 0) {
      return this.state.messages.map((x, i) => {
        return <Animate from='0' to='1' attributeName='opacity' duration='600'>
            <div className="messages" style={{flexDirection: this.props.user.id === x.userId ? 'row-reverse' : 'row'}}>

              <li className={this.props.user.id === x.userId ? 'userBubble' : 'partnerBubble'} id={x.id} key={i}>
                {// (x.userId===this.props.user.id?this.state.name:this.state.partnerName) + ": " +
                  x.message}
              </li>

            </div>
          </Animate>;
      });
    }

      this.updateScroll();
  };

  updateScroll=()=>{
    let objDiv = document.getElementsByClassName('chatWindow')[0];
    if (this.state.messages.length>0) {
    objDiv.scrollTop = objDiv.scrollHeight
;
}
  }

  render() {
    return this.state.loading ? <div></div> : (
      <Animate to={'0.99'} from={'0.01'} attributeName="opacity" duration={1000}>
    <div>
        <div />
        <button className='backButton' onClick={this.goBack}>{'❮ Back'}</button>
        <div className="dealButtonsContainer">
         {// <button className='cornerButton rejectButton'>Reject</button>
         }
          {this.state.complete ? <button className="cornerButton dis" disabled>
              Complete!
            </button> : this.state.completeSend?<button className="cornerButton dis" disabled>
              Awaiting Reply...
            </button> : this.state.deal ? <button className="cornerButton" onClick={this.completeJob}>
              Complete Job
            </button> : this.state.offer ? <button className="cornerButton dis" disabled>
              Job Offered
            </button> : <button className="cornerButton" onClick={this.deal}>
              {this.state.offered ? (this.isPatron? '':'Accept Job'):(this.isPatron? 'Offer Job':'')}
            </button>}
        </div>
        <div className='chatHeader'>
        <div className='pageTitle'>
          {this.state.partnerName + ' - "' + this.state.job.jobTitle + '"'}
        <div className='split chatSplit'><hr/></div>
        </div></div>
        <div className="chatWindow" id='chatwindow'>
          <ul>{this.renderMessages()}</ul>
        </div>

         <div className="splitChat"> <hr/> </div>

        <div className="chatInput">
          <form onSubmit={this.handleSubmit}>
            <input type="text" ref='chat' placeholder="Work out the details!" onChange={this.handleChange} id="chatbar" autocomplete='off' autoFocus={true} />
          </form>
        </div>
      </div>
      </Animate>);
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  jobs: state.data.jobs,
});

export default connect(mapStateToProps)(Chat);
