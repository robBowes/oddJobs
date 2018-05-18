import React, { Component } from "react";
import { connect } from "react-redux";

// A series of three unique steps for onboarding users on
//initial login. Will walk users through configuring
//their initial settings and explaining these settings
//one step at a time. Each step will advance a users
//welcome staging number. When users complete the third step
//They are never shown this page again

class WelcomeStaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50,
      minPayValue: 0,
      maxPayValue: 40,
      categories: [],
      boxCategories: [
        "general",
        "lawncare",
        "automotive",
        "cleaning",
        "plumbing",
        "housekeeping",
        "carpentry",
        "petcare",
        "it"
      ],
    };
  }
  handleClickNext = event => {
    event.preventDefault();
    fetch("/modify", {
      method: "PUT",
      credentials: "same-origin",
      body: JSON.stringify({
        minPrice: this.state.minPayValue,
        maxPrice: this.state.maxPayValue,
        maxDistance: this.state.sliderValue,
        categories: this.state.categories,
        welcomeStage: 2
      })
    })
      .then(x => x.json())
      .then(y => {
        console.log(y);
        if (!y.status) throw new Error(y.reason);
        this.props.dispatch({
          type: "USER_UPDATE",
          payload: y.user
        });
      });
  };
  sliderChange = event => {
    this.setState({ sliderValue: event.target.value });
  };
  handleMinChange = event => {
    event.preventDefault();
    this.setState({ minPayValue: event.target.value });
  };
  handleMaxChange = event => {
    event.preventDefault();
    this.setState({ maxPayValue: event.target.value });
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
      return (
        <div className="tickBox">
        <input
          onChange={this.tickChange}
          key={i}
          id={x}
          className="categoryCheckBox"
          type="checkbox"
          name={x}
        />
        <label className="tickLabel" htmlFor={x}>{x}</label>
        </div>
      );
    });
  };
  render() {
    return (
      <div className="welcomeStage2">
        <h1 className="welcomeText2">
          {" "}
          Let's start by setting up your job preferences!
        </h1>

        <form className="welcomeForm" onSubmit={this.handleSubmit}>
          <div className="rangeWrapper">
            <h2 className="welcomeHeader"> Show Jobs Within: </h2>
            <div className="distanceReadout"><p>{this.state.sliderValue + "km"}</p></div>
            <div className="lineBreaks">
            <hr />
            <div className="sliderInner">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={this.state.sliderValue}
                  onChange={this.sliderChange}
                  className="kmSlider"
                  id="welcomeSlider"
                />
              </div>
              <hr />
            </div>
          </div>
          <div className="payWrapper">
          <h2 className="welcomeHeader"> Show Jobs Paying: </h2>
          <input
            className="welcomeInputMinMax"
            value={this.state.minPayValue}
            onChange={this.handleMinChange}
            type="number"
            placeholder="from"
          />{" "}
          -{" "}
          <input
            className="welcomeInputMinMax"
            value={this.state.maxPayValue}
            onChange={this.handleMaxChange}
            type="number"
            placeholder="to"
          />
          </div>
          <div className="interestsWrapper">
          <h2 className="welcomeHeader"> I'm interested in: </h2>
          <div className="interestsButtonWrapper">
          {this.mapCheckBoxes(this.state.boxCategories)}
          </div>
          </div>
          <div className="buttonWrapper">
          <button
            type="submit"
            className="welcomeButton"
            onClick={this.handleClickNext}
          >
            Next
          </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //redux props import
});

export default connect(mapStateToProps)(WelcomeStaging);
