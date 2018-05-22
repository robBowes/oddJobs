import React, {Component} from 'react';
import {connect} from 'react-redux';

class GetLocation extends Component {
    approve=()=>{
    fetch('/modify', {
  method: 'PUT',
  body: JSON.stringify({location: {lat, lng}}),
})
  .then((x) => x.json())
  .then((y) => {
    if (!y.status) console.log(y);
    this.props.dispatch({
      type: 'USER_UPDATE',
      payload: y.user,
    });
  });
}
render() {
    return <div>TEST</div>;
}
}

mapStateToProps
;
