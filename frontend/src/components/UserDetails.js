import React, { Component } from "react";
import { connect } from "react-redux";

//This component renders the details for a given user
//When viewing user details page
//pic, description, statistics

class UserDetails extends Component {
    constructor(props){
        super(props);
        this.state ={
            loading: true
        }
    }
    componentDidMount=()=>{
        this.setState({loading: false})
    }
  render() {
      return this.state.loading===true?
      <div>Loading data</div>
        :
      <div><img src={this.props.user.picture?this.props.user.picture.data.url:'loading image'}/>
      <br/>
      <h3>{this.props.user.name}</h3><br/>
      {this.props.user.description}
      <br/>
      <br/>
      Some rating 99
      </div>
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(UserDetails);
