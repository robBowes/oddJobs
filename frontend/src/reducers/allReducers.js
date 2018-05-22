import {combineReducers} from 'redux';
import example from './example.js';
import user from './user.js';
import data from './data.js';

const allReducers = combineReducers({
    example,
    user,
    data,
});

export default allReducers;
