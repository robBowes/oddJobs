const mongoose = require('mongoose');

/*
Error handling middleware
*/
const handleE11000 = function(error, res, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next();
    }
};

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
    maxDistance: {type: String, default: '50'},
    maxPrice: String,
    minPrice: String,
    statistics: {
        jobsAccepted: {type: Number, default: 0},
        jobsCompleted: {type: Number, default: 0},
        jobsCanceled: {type: Number, default: 0},
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
    return cleanUser;
};

UserSchema.methods.backOut = function(jobId) {
    this.statistics.jobsCanceled++;
    this.pairs = this.pairs.filter((job)=>job.id!==jobId);
};

const User = mongoose.model('User', UserSchema);

const JobSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    jobDescription: {type: String, required: true},
    jobTitle: {type: String, required: true},
    jobPay: {type: String, default: '0'},
    categories: [String],
    patronId: {type: String, required: true},
    picture: {type: String, required: true},
    helperId: {type: String, default: ''},
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
        time: {type: Number, default: 0},
        userId: {type: String, required: true},
        messages: [{
            userId: String,
            message: String,
        }],
    }],
});

JobSchema.methods.addHelper = function(helperId) {
    if (!this.pairedHelpers.some((helper)=>helper===helperId)) {
        this.pairedHelpers = [...this.pairedHelpers, helperId];
    }
};

JobSchema.methods.addDeal = async function(userId, counterParty) {
    let userIsPatron = userId === this.patronId;
    if (userIsPatron) {
        if (!counterParty) throw new Error('counterparty must exist');
        // this.dealsOfferedByPatron = [
        //     ...this.dealsOfferedByPatron, counterParty,
        // ];
        this.dealsOfferedByPatron.push(counterParty);
    } else if (!this.dealsOfferedByHelpers.some((helper)=>helper===userId)) {
        // this.dealsOfferedByHelpers = [...this.dealsOfferedByHelpers, userId];
        this.dealsOfferedByHelpers.push(userId);
    }
    let match = this.dealsOfferedByPatron.find((patronDeal)=>{
        return this.dealsOfferedByHelpers.some(
            (helperDeal)=>helperDeal===patronDeal
        );
    });
    if (!!match) {
        this.helperId = match;
        this.dealDate = Date.now();
        this.pairedHelpers = [this.helperId];
        this.dealsOfferedByHelpers = [];
        this.dealsOfferedByPatron = [];
        this.dealMade = true;
        this.markModified('dealMade');
    }
    delete this.__v;
    return this;
};

JobSchema.methods.removePatron = function() {
    this.patronId = 'deleted';
    this.pairedHelpers = [];
    this.save();
};

JobSchema.methods.addMessage = async function(user, message, partner) {
    let userIsPatron = user.id ===this.patronId;
    let chatRoomID = userIsPatron?partner:user.id;
    let chatRoom = this.messages.find((m)=>m.userId ===chatRoomID);
    if (!chatRoom) {
        chatRoom = {
            time: Date.now(),
            userId: userIsPatron?partner:user.id,
            messages: [{userId: user.id, message: message}],
        };
        this.messages = [...this.messages, chatRoom];
    }
    let chatId = this.messages.findIndex((m)=>m.userId === chatRoom);
    chatRoom.messages = chatRoom.messages.concat(
        {userId: user.id, message: message}
    );
    this.messages[chatId] = chatRoom;
    await this.save();
};

JobSchema.methods.removeHelper = function(id) {
    this.pairedHelpers = this.pairedHelpers.filter((helper)=>helper!== id);
    this.save();
};

JobSchema.methods.complete = function(id) {
    let userIsPatron = id ===this.patronId;
    if (userIsPatron) {
        this.completedByPatron = true;
    } else {
        this.completedByHelper = true;
    }
    if (this.completedByHelper && this.completedByPatron) {
        this.completedDate = Date.now();
    }
};

JobSchema.methods.backOut = function(userid, jobId) {
    let userIsPatron = userid ===this.patronId;
    this.dealMade = false;
    this.helperId = '';
    this.dealDate = 0;
    this.pairs = [];
};


JobSchema.post('save', handleE11000);

const Job = mongoose.model('Job', JobSchema);
// const User = mongoose.model('User', UserSchema);


module.exports = {User, Job};

