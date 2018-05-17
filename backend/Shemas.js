const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    accessToken: String,
    appToken: String,
    first_name: String,
    picture: Object,
    jobsListed: [Object],
    pairs: [Object],
    distance: {type: String, default: 0},
    location: {
        lat: {type: String},
        lng: {type: String},
    },
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
    jobInProgress: {type: Boolean, default: false},
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
    dealsOfferedByPatron: [String],
    dealsOfferedByHelpers: [String],
    dealMade: {type: Boolean, default: false},
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
        // jobId: {type: String, required: true},
        lastMessage: {type: Number, default: 0},
        userId: {type: Number, required: true},
        messages: [{
            user: String,
            message: String,
        }],
    }],
});

JobSchema.methods.addHelper = function(helperId) {
    if (!this.pairedHelpers.some((helper)=>helper===helperId)) {
        this.pairedHelpers = [...this.pairedHelpers, helperId];
    }
};

JobSchema.methods.addDeal = function(userId) {
    if (userId === this.patronId) {
        this.dealsOfferedByPatron = [...this.dealsOfferedByPatron, userId];
    } else if (this.pairedHelpers.some((helper)=>helper===userId)) {
        this.dealsOfferedByHelpers = [...this.dealsOfferedByHelpers, userId];
    }
    let match = this.dealsOfferedByPatron.find((patronDeal)=>{
        return this.dealsOfferedByHelpers.some((helperDeal)=>helperDeal===patronDeal);
    });
    if (!!match) {
        this.helperId = match;
        this.dealDate = Date.now();
        this.dealMade = true;
    }
    this.save();
    return this.toObject();
};

JobSchema.methods.removePatron = function() {
    this.patronId = 'deleted';
    this.pairedHelpers = [];
    this.save();
};

JobSchema.methods.removeHelper = function(id) {
    this.pairedHelpers = this.pairedHelpers.filter((helper)=>helper!== id);
    this.save();
};

const Job = mongoose.model('Job', JobSchema);
// const User = mongoose.model('User', UserSchema);


module.exports = {User, Job};

