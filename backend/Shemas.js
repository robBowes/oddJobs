const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    accessToken: String,
    appToken: String,
    firstName: String,
    picture: Object,
    jobsListed: [Number],
    pairs: [Number],
    currentJob: Number,
    jobsDeclined: [Number],
    jobsCompleted: [Number],
    signupDate: Number,
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

const User = mongoose.model('User', UserSchema);

const JobSchema = new mongoose.Schema({
    id: Number,
    jobDescription: String,
    jobTitle: String,
    jobPay: String,
    patronId: String,
    picture: String,
    helperId: String,
    pairedHelpers: [String],
    location: Object,
    listingDate: Number,
    dealDate: Number,
    completedDate: Number,
    completedByPatron: Boolean,
    completedByHelper: Boolean,
    messages: Object,
});


module.exports = {User};

