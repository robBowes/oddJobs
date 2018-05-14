import {combineReducers} from 'redux';
import example from './example.js';
import user from './user.js'

const allReducers = combineReducers({
    example,
    user
});

export default allReducers;
