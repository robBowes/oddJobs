const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    accessToken: String,
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
    statistics: {
        jobsAccepted: Number,
        jobsCompleted: Number,
        jobsCanceled: Number,
    },
    jobInProgress: Boolean,
    welcomeStage: String,
    name: String,
    email: String,
});

UserSchema.methods.speak = function() {
    console.log(this.id);
};

const User = mongoose.model('User', UserSchema);
module.exports = {User};

