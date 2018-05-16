import React, { Component } from "react";
import { connect } from "react-redux";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.description,
      maxDistance: props.maxDistance,
      minPrice: props.minPrice,
      maxPrice: props.maxPrice,
      categories: props.categories,
      boxCategories: [
        "general",
        "lawncare",
        "automotive",
        "cleaning",
        "plumbing",
        "housekeeping",
        "carpentry",
        "pet care",
        "it"
      ],
      loading: true
    };
  }
  componentWillReceiveProps = props => {
    this.setState(props);
  };
  handleSubmitButton = event => {
    event.preventDefault();
    fetch('/modify', {
      method: "PUT",
      credentials: 'same-origin',
      body: JSON.stringify({
        description: this.state.description,
        maxDistance: this.state.maxDistance,
        minPrice: this.state.minPrice,
        maxPrice: this.state.maxPrice,
        categories: this.state.categories,
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
  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  };
  sliderChange = event => {
    this.setState({ maxDistance: event.target.value });
  };
  handleMinChange = event => {
    event.preventDefault();
    this.setState({ minPrice: event.target.value });
  };
  handleMaxChange = event => {
    event.preventDefault();
    this.setState({ maxPrice: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
  };
  tickChange = event => {
    if (event.target.checked) {
      let newCategories = [...this.state.categories];
      newCategories = newCategories.concat(event.target.name);
      this.setState({ categories: newCategories });
      return;
    }
    this.setState({
      categories: this.state.categories.filter(x => x !== event.target.name)
    });
  };
  mapCheckBoxes = categories => {
    return categories.map((x, i) => {
      if (!this.props.categories) return;
      let isSelected = this.state.categories.some(e => e === x);
      return (
        <input
          onChange={this.tickChange}
          key={i}
          className="categoryCheckBox"
          type="checkbox"
          name={x}
          checked={isSelected}
        />
      );
    });
  };
  goBack = () => {
    window.history.back();
  }
  componentDidMount = () => {
    this.setState({ loading: false });
  };
  render() {
    return this.state.loading ? (
      <div>Loading</div>
    ) : (
      <div className="userSettingsPage">
        <button className="backButton" onClick={this.goBack}>Back</button>
        <img
          className="userPicture"
          src={this.props.picture ? this.props.picture.data.url : ""}
          alt="user profile"
        />
        <form onSubmit={this.handleSubmit}>
          <h2 className="settingsHeader"> Description: </h2>
          <textarea
            className="welcomeDescriptionInput"
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            type="textarea"
            rows="5"
            cols="50"
            placeholder="This is who I am and the stuff I like to do!"
          />
          <h2 className="settingsHeader"> Show Jobs Within: </h2>
          <input
            type="range"
            min="1"
            max="100"
            value={this.state.maxDistance}
            onChange={this.sliderChange}
            className="kmSlider"
            id="welcomeSlider"
          />{" "}
          <p className="distanceReadout">{this.state.maxDistance + "km"}</p>
          <h2 className="settingsHeader"> Show Jobs Paying: </h2>
          <input
            className="welcomeInputMinMax"
            value={this.state.minPrice}
            onChange={this.handleMinChange}
            type="number"
            placeholder="from"
          />{" "}
          -{" "}
          <input
            className="welcomeInputMinMax"
            value={this.state.maxPrice}
            onChange={this.handleMaxChange}
            type="number"
            placeholder="to"
          />
          <h2 className="welcomeHeader"> I'm interested in: </h2>
          {this.mapCheckBoxes(this.state.boxCategories)}
          <button
            type="submit"
            className="welcomeButton"
            onClick={this.handleSubmitButton}
          >
            Update
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  picture: state.user.picture,
  description: state.user.description,
  maxDistance: state.user.maxDistance,
  minPrice: state.user.minPrice,
  maxPrice: state.user.maxPrice,
  categories: state.user.categories
});

export default connect(mapStateToProps)(UserSettings);
