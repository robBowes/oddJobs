import React, { Component } from "react";
import { connect } from "react-redux";

/* global google */

class NewJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTitle: '',
      jobPay: '',
      jobAddress: '',
      jobDetails: '',
      image:'',
      geolocation: {},
      locationHasLoaded: false,
      imageHasLoaded: false,
    };
  }
  handleClickSubmit = event => {
    event.preventDefault();
    fetch('/addJob', {
      method: "PUT",
      credentials: 'same-origin',
      body: JSON.stringify({
        jobName: this.state.jobTitle,
        jobDescription: this.state.jobDetails,
        location: {},
        price: this.state.jobPay,
        filename: '',
      })
    })
    .then(x => x.json())
    .then(y => {
      console.log(y)
      if (!y.status) throw new Error(y.reason)
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
  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);
          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = "AIzaSyCbrOIME0qqdPjO-rgbqX_1L7uPxWvYbaw";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }
  getGeocode = () => {
    this.getGoogleMaps().then((google) => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.state.jobAddress}, function(results, status) {
        if (status == 'OK') {
          console.log(results[0].geometry.location);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    })
  }
  componentWillMount = () => {
    // Start Google Maps API loading since we know we'll soon need it
    console.log("test")
    this.getGoogleMaps();
  }
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
            type="number"
            placeholder="Job Pay"
          />

          <h2 className="formHeader"> Address: </h2>
          <input
            className="jobInput"
            value={this.state.jobAddress}
            onChange={this.handleAddressChange}
            onBlur={this.getGeocode}
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
