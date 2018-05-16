const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    accessToken: String,
    appToken: String,
    first_name: String,
    picture: Object,
    jobsListed: [Number],
    pairs: [Number],
    currentJob: Number,
    jobsDeclined: [Number],
    jobsCompleted: [Number],
    signupDate: {type: Number, default: Date.now()},
    description: String,
    lastLoginDate: Number,
    categories: [String],
    currentLocation: Object,
    maxDistance: String,
    maxPrice: String,
    minPrice: String,
    statistics: {
        jobsAccepted: Number,
        jobsCompleted: Number,
        jobsCanceled: Number,
    },
    jobInProgress: Boolean,
    welcomeStage: {type: Number, default: 0},
    name: String,
    email: String,
});

UserSchema.methods.speak = function() {
    console.log(this.id);
};

UserSchema.methods.clean = function() {
    let dirtyUser = {...this.toObject()};
    let cleanUser = {};
    cleanUser.id = dirtyUser.id;
    cleanUser.name = dirtyUser.name;
    cleanUser.picture = dirtyUser.picture;
    cleanUser.signupDate = dirtyUser.signupDate;
    cleanUser.description = dirtyUser.description;
    cleanUser.lastLoginDate = dirtyUser.lastLoginDate;
    cleanUser.statistics = dirtyUser.statistics;
    cleanUser.jobInProgress = dirtyUser.lastLoginDate;
    return cleanUser;
};

const User = mongoose.model('User', UserSchema);

const JobSchema = new mongoose.Schema({
    id: {type: String, default: Math.floor(Math.random()*1000000).toString()},
    jobDescription: {type: String, required: true},
    jobTitle: {type: String, required: true},
    jobPay: {type: String, default: '0'},
    patronId: {type: String, required: true},
    picture: {type: String, required: true},
    helperId: String,
    pairedHelpers: [String],
    location: {
        lat: {type: String, required: true},
        lng: {type: String, required: true},
    },
    listingDate: {type: String, default: Date.now()},
    dealDate: {type: Number, default: 0},
    completedDate: {type: Number, default: 0},
    completedByPatron: {type: Boolean, default: false},
    completedByHelper: {type: Boolean, default: false},
    messages: [{
        jobId: {type: String, required: true},
        lastMessage: Number,
        userId: {type: Number, required: true},
        messages: [{
            user: String,
            message: String,
        }],
    }],
});

const Job = mongoose.model('Job', JobSchema);
// const User = mongoose.model('User', UserSchema);


module.exports = {User, Job};

