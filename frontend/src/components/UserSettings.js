import React, { Component } from "react";
import { connect } from "react-redux";

class UserSettings extends Component {
  constructor(props){
    super(props)
    this.state = {
      description: '',
      sliderValue: 50,
      minPayValue: 0,
      maxPayValue: 40,
      categories: [],
      boxCategories: ['general','lawncare','automotive','cleaning'
      ,'plumbing','housekeeping','carpentry','pet care','it'],
      loading: true,
    }
  }
  handleSubmitButton = (event) => {

  }
  handleDescriptionChange = (event) => {
   this.setState({ description: event.target.value });
  }
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
    if (event.target.checked){
      let newCategories = [...this.state.categories];
      newCategories = newCategories.concat(event.target.name);
      this.setState({categories: newCategories})
      return
    }
    this.setState({categories: this.state.categories.filter(x => x !== event.target.name)})
  }
  mapCheckBoxes = (categories) => {
    return categories.map((x,i) => {
    return (
       <input onChange={this.tickChange} key ={i} className="categoryCheckBox" type="checkbox" name={x}/>
  )
    })
  }
  componentDidMount = () => {
    this.setState({loading: false})
  }
  render() {
    return this.state.loading?<div>Loading</div>:(
      <div className="userSettingsPage">
      <img className="userPicture" src={this.props.picture?this.props.picture.data.url:''} alt="user profile"/>
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
            value={this.state.sliderValue}
            onChange={this.sliderChange}
            className="kmSlider"
            id="welcomeSlider"
          />
          <h2 className="settingsHeader"> Show Jobs Paying: </h2>
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
    )
  }
}

const mapStateToProps = state => ({
  picture: state.user.picture,
  description: state.user.description,
  maxDistance: state.user.maxDistance,
  minPrice: state.user.minPrice,
  maxPrice: state.user.maxPrice,
  categories: state.props.categories,
});

export default connect(mapStateToProps)(UserSettings);
