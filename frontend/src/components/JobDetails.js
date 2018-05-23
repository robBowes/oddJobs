import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MoonLoader} from 'react-spinners';
import Animate from 'react-smooth';

// This component renders the details for a given job
// When viewing job details page
// pic, description, pertinent info

class JobDetails extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
        };
    }
    componentWillReceiveProps=(props)=>{
        // console.log(props);
    }
    componentWillMount = () => {
        this.props.dispatch({type: 'TOGGLE_LOADING'});
    }
    componentDidMount=()=>{
        // let job = this.props.jobs.filter((x) => {
        //     console.log(x, this.props);
        //     return x.id === this.props.id;
        //   })[0];
        console.log(this.props.id)
        fetch('/job',{
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({id: this.props.id})
        })
        .then(x=>x.json())
        .then(y=>{
            console.log(y)
            return y.job
        })
        .then(z=>{
            let job = z
            fetch('/user', {
                method: 'POST',
                credentials: 'same-origin',
                body: JSON.stringify({id: job.patronId}),
            })
            .then((x)=>x.json())
            .then((y)=>{
                if (!y.status) console.log(y);
                this.setState({
                    loading: false,
                    job: job,
                    patron: y.user,
                });
                this.props.dispatch({type: 'TOGGLE_LOADING'});
            });
        })
        }
  render() {
      return this.state.loading ? <div></div> :  <Animate to={"0.99"} from={"0.01"} attributeName="opacity" duration={1000}>
      <div>
            <div>
          <div className="pageTitle">
            {this.state.job ? this.state.job.jobTitle + ' - ' + '$' + this.state.job.jobPay : null}
            </div>
            <div className='split'><hr/></div>

          </div>
          <div className="jobPictureContainer">
            <img className="jobPicture" src={this.state.job ? this.state.job.picture : ''} alt="" />
            <br />
          </div>
          <div className="patronBar">
            <img className="jobDetailsPatronPicture" src={this.state.patron.picture.data.url} />
            <div className="jobDetailsName">{this.state.patron.name} </div><div className='jobDetailsKm'> {this.state.job?Math.floor(this.state.job.distance/100)/10 + 'km':null} </div>
          </div>
          <div className="jobDescriptionDetailsWrapper">

          <div className='jobDetailsStyling'>Details:</div>
          <span className='jobDetailDescription'>{this.state.job ? this.state.job.jobDescription : null}</span>

         
          </div>
        </div></Animate>;
  }
}

const mapStateToProps = (state) => ({
    jobs: state.data.jobs,
});

export default connect(mapStateToProps)(JobDetails);
