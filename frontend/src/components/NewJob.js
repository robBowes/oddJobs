import React, {Component} from 'react';
import {connect} from 'react-redux';
import Animate from 'react-smooth';

/* global google */

class NewJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTitle: '',
      jobPay: '',
      jobAddress: '',
      jobDetails: '',
      image: '',
      categories: ['general'],
      geolocation: {},
      locationHasLoaded: false,
      imageHasLoaded: false,
      errorMessage: '',
    };
  }
  handleClickSubmit = (event) => {
    event.preventDefault();
    fetch('/addJob', {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        jobTitle: this.state.jobTitle,
        jobDescription: this.state.jobDetails,
        location: this.state.geolocation,
        jobPay: this.state.jobPay,
        picture: this.state.image,
        categories: this.state.categories,
      }),
    })
    .then((x) => x.json())
    .then((y) => {
      if (!y.status) throw new Error(y.reason);
      fetch('/user', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({id: this.props.user.id}),
      })
      .then((x)=> x.json())
      .then((y) => {
      if (!y.status) throw new Error(y.reason);
      else {
        console.log('IN DISPATCH', y);
      this.props.dispatch({
        type: 'USER_UPDATE',
        payload: y.user,
    });
}
});
    });

    window.history.back();
  };
  handleTitleChange = (event) => {
    event.preventDefault();
    this.setState({jobTitle: event.target.value});
  };
  handlePayChange = (event) => {
    event.preventDefault();
    this.setState({jobPay: event.target.value});
  };
  handleAddressChange = (event) => {
    event.preventDefault();
    this.setState({jobAddress: event.target.value});
  };
  handleDetailsChange = (event) => {
    event.preventDefault();
    this.setState({jobDetails: event.target.value});
  };
  handleSubmit = (event) => {
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
        const script = document.createElement('script');
        const API = 'AIzaSyCbrOIME0qqdPjO-rgbqX_1L7uPxWvYbaw';
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
      geocoder.geocode( {'address': this.state.jobAddress}, (results, status) => {
        if (status === 'OK') {
          let lat = results[0].geometry.location.lat();
          let lng = results[0].geometry.location.lng();
          this.setState({geolocation: {lat, lng}, locationHasLoaded: true, errorMessage: ''});
        } else {
          this.setState({errorMessage: 'Invalid Address'});
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }
  tickChange = (event) => {
    if (event.target.checked) {
      let newCategories = [...this.state.categories];
      newCategories = newCategories.concat(event.target.name);
      this.setState({categories: newCategories});
      return;
    }
    this.setState({
      categories: this.state.categories.filter((x) => x !== event.target.name),
    });
  };
  mapCheckBoxes = (categories) => {
    return categories.map((x, i) => {
      // if (!this.props.categories) return;
      let isSelected = this.state.categories.some((e) => e === x);
      return (
        <div className="tickBox" key={i + 'tickbox'}>
          <input
            onChange={this.tickChange}
            id={x}
            className="categoryCheckBox"
            type="checkbox"
            name={x}
            checked={isSelected}
          />
          <label className="tickLabel" htmlFor={x}>
            {x}
          </label>
        </div>
      );
    });
  };
  uploadPicture = (event) => {
    let image = event.target.files[0];
    let filename = image.name;
    let extension = filename.split('.').pop();
    fetch('/uploadImage?ext=' + extension, {
      method: 'PUT',
      credentials: 'same-origin',
      body: image,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          alert('Error!');
          return new Error('upload');
        }
        console.log(data);
        this.setState({image: data.name, imageHasLoaded: true});
      })
      .catch((e) => console.log(e));
  }
  goBack = () => {
    window.history.back();
  }
  componentWillMount = () => {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }
  render() {
    const leave = {
      from: 'translateY(-300%)',
      to: 'translateY(0%)',
      attributeName: 'transform',
    };
    const appear = {
      from: 'translateY(0%)',
      to: 'translateY(-300%)',
      attributeName: 'transform',
    };
    return ( 
      <Animate to={"0.99"} from={"0.01"} attributeName="opacity" duration={1000}>
      <div className="newJobPage">

      <button className="backButton" onClick={this.goBack}>{'❮ Back'}</button>

        <h1 className="pageTitle">
          New Job
        </h1>
         <div className="split">
         <hr/>
         </div>

         <form onSubmit={this.handleSubmit}>

          <h2 className="formHeader"> Title: </h2>
          <input
            className="jobInput"
            value={this.state.jobTitle}
            onChange={this.handleTitleChange}
            type="text"
            placeholder="Job title"
            maxLength="30"
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
          /> <p className="addressError">{this.state.errorMessage}</p>

          <h2 className="formHeader"> Details: </h2>
          <input
            className="jobInput"
            value={this.state.jobDetails}
            onChange={this.handleDetailsChange}
            type="text"
            placeholder="This is what the job is all about"
          />

          <div className="interestsWrapper">
            <h2 className="welcomeHeader"> This job is: </h2>
            <div className="interestsButtonWrapper">
              {this.mapCheckBoxes(['general',
        'lawncare',
        'automotive',
        'cleaning',
        'plumbing',
        'housekeeping',
        'carpentry',
        'pet care',
        'it',
      ])}
            </div>
          </div>

          <h2 className="formHeader"> Upload an Image: </h2>
          <div className="uploadWrapper">
          <span className="fileText">Upload File</span>
          <input
          type="file"
          name="pic"
          className="uploadButton"
          onChange={this.uploadPicture}
          accept="image/*"
          />
          </div>
           <span className="mandatoryText">*All Fields Mandatory</span>
          <div className="buttonWrapper2">
          <button
            type="submit"
            className="submitButton"
            onClick={this.handleClickSubmit}
            disabled={!this.state.imageHasLoaded
              || !this.state.locationHasLoaded
              || this.state.jobTitle.length===0
            || this.state.jobDetails.length===0
            || this.state.jobPay.length===0 }
            >
            Submit
          </button>
          </div>
        </form>
      </div>
      </Animate>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(NewJob);
