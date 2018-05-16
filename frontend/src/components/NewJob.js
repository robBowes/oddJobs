import React, { Component } from "react";
import { connect } from "react-redux";

class NewJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTitle: '',
      jobPay: '',
      jobAddress: '',
      jobDetails: '',
      image:'',
    };
  }
  handleClickSubmit = event => {
    event.preventDefault();
    fetch('/modify', {
      method: "PUT",
      credentials: 'same-origin',
      body: JSON.stringify({
        description: this.state.description,
        welcomeStage: 3
      })
    })
    .then(x => x.json())
    .then(y => {
      console.log(y)
      if (!y.status) throw new Error(y.reason)
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user,
      })
    })
  };
  handleTitleChange = event => {
    event.preventDefault();
    this.setState({ jobTitle: event.target.value });
  };
  handlePayChange = event => {
    event.preventDefault();
    this.setState({ jobPay: event.target.value });
  };
  handleAddressChange = event => {
    event.preventDefault();
    this.setState({ jobAddress: event.target.value });
  };
  handleDetailsChange = event => {
    event.preventDefault();
    this.setState({ jobDetails: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
  };
  render() {
    return (
      <div className="newJobPage">

        <h1 className="pageTitle">
          New Job
        </h1>
           
         <form onSubmit={this.handleSubmit}>

          <h2 className="formHeader"> Title: </h2>
          <input
            className="jobInput"
            value={this.state.jobTitle}
            onChange={this.handleTitleChange}
            type="text"
            placeholder="Job title"
          />

          <h2 className="formHeader"> Pay: </h2>
          <input
            className="jobInput"
            value={this.state.jobPay}
            onChange={this.handlePayChange}
            type="text"
            placeholder="Job Pay"
          />

          <h2 className="formHeader"> Address: </h2>
          <input
            className="jobInput"
            value={this.state.jobAddress}
            onChange={this.handleAddressChange}
            type="text"
            placeholder="1500 University Street, Montreal, H3A3S7"
          />

          <h2 className="formHeader"> Details: </h2>
          <input
            className="jobInput"
            value={this.state.jobDetails}
            onChange={this.handleDetailsChange}
            type="text"
            placeholder="This is what the job is all about"
          />

          <h2 className="formHeader"> Details: </h2>
          <input type="file" name="pic" accept="image/*"/>

          <button
            type="submit"
            className="submitButton"
            onClick={this.handleClickNext}
          >
            Submit
          </button>    
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(NewJob);
