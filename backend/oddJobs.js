const utils = require('./utils');
const sha1 = require('sha1');
const r = require('./utils');
const fs = require('fs');
const geolib = require('geolib');

const deepUser = async (Job, user, User) => {
    let findUserInner = findUser(User);
    let userIsPatron = await Job.find({patronId: user.id}).lean();
    let userIsPair = await Job.find({pairedHelpers: user.id}).lean();
    let returnUser = user.toObject();
    let cleanPairs = userIsPair.map((job)=>{
        job.messages = job.messages.filter((messageObj)=>{
            return messageObj.userId === user.id;
        });
        return job;
    });
    cleanPairs = cleanPairs.map(async (job)=>{
        if (job.location.lat && user.location.lat) {
            job.distance = r.distanceBetween(job, user);
        }
        job.pairedHelpers = job.pairedHelpers.map(async (helper)=>{
            let obj = {id: helper};
            let reply = await findUserInner(obj);
            return reply.user;
        });
        job.pairedHelpers = await Promise.all(job.pairedHelpers);
        return job;
    });
    userIsPatron = userIsPatron.map((job)=>{
        if (job.location.lat && user.location.lat) {
            job.distance = r.distanceBetween(job, user);
        }
        return job;
    });
    cleanPairs = await Promise.all(cleanPairs);
    returnUser.pairs = cleanPairs;
    returnUser.jobsListed = userIsPatron;
    return returnUser;
};

const modify = async (user, newProps) =>{
    if (!user) return {status: false, reason: 'no user found'};
    Object.assign(user, newProps);
    let status = true;
    let reason = '';
    await user.save().catch((err)=>{
        status = false;
        reason = 'data rejected by database';
    });
    return {status, user, reason};
};

const login = (Job, User)=> async (fb, cookie, User, user) => {
    if (!user &&
        (!fb.id ||
            !fb.name ||
            !fb.accessToken
        )
    ) return {status: false, reason: 'no facebook data'};

    let fbIsValid;
    if (fb) fbIsValid = r.checkFbToken(fb);
    if (!user) {
        user = await User.findOne({id: fb.id});
        if (!user) {
            user = await new User(fb);
        }
        user.appToken = sha1(Date.now());
        user.save();
    }

    let newUser = await deepUser(Job, user, User);
    return {status: true, user: newUser};
};

const newJob = (Job) => async (user, jobDetails = {}) => {
    if (!user) return {status: false, reason: 'no user found'};
    let status = true;
    let reason;
    jobDetails.patronId = user.id;
    try {
        job = await new Job(jobDetails);
        await job.save();
    } catch (error) {
        status = false;
        reason = 'Invalid job details';
        job = null;
    }
    return {status, job, reason};
};

const findJob = (Job) => async (body) => {
    if (!body.id) return {status: false, reason: 'no body included'};
    const job = await Job.findOne(body);
    if (job) return {status: true, job};
    else return {status: false, reason: 'job could not be found'};
};

const uploadImage = (req) => {
    let extension = req.query.ext.split('.').pop();
    if (extension.length < 1) {
        return {status: false, reason: 'invalid extension'};
    }
    if (!req.body) {
        return {status: false, reason: 'empty image body'};
    }
    let randomString = '' + Math.floor(Math.random() * 10000000);
    let filename = randomString + '.' + extension;
    fs.writeFile('./data/images/' + filename, req.body,
    (err)=>err?console.log(err):null);
    return {status: true, name: filename};
};

const findUser = (User) =>async (params) => {
    let user = await User.findOne(params);
    if (!user) return {status: false, reason: 'No user found'};
    let cleanUser = user.clean();
    return {status: true, user: cleanUser};
};

const allJobs = (Job) => async (user, location) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!location ||
        !location.lng ||
        !location.lat
    ) return {status: false, reason: 'no location information'};
    user.location = location;
    user.update();
    let jobs = await Job.find();
    return {status: true, content: jobs};
};

const pairJob = (Job) => async (user, jobId) =>{
    if (!user) return {status: false, reason: 'no user information'};
    if (!jobId.id) return {status: false, reason: 'no job information'};
    let job = await Job.findOne(jobId);
    job.addHelper(user.id);
    await job.save();
    let newUser = await deepUser(Job, user);
    return {status: true, job, user: newUser};
};

const offerDeal = (Job) => async (user, jobId) =>{
    if (!user) return {status: false, reason: 'no user information'};
    if (!jobId.id) return {status: false, reason: 'no job information'};
    let job = await Job.findOne(jobId);
    if (!job) return {status: false, reason: 'job not found'};
    let jobWithDeal = await job.addDeal(user.id);
    return {status: true, job: jobWithDeal};
};

const rejectJob = (Job) => async (user, jobId) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!jobId) return {status: false, reason: 'no job information'};
    let job = await Job.findOne({id: jobId});
    if (!job) return {status: false, reason: 'job not found'};
    if (user.id ===job.patronId) {
        job.removePatron();
        return {status: true, user: await deepUser(Job, user)};
    } else await job.removeHelper(user.id);
    return {status: true, user: await deepUser(Job, user)};
};

const sendMessage = (Job) => async (user, body) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!body.id) return {status: false, reason: 'no job information'};
    let job = await Job.findOne({id: body.id});
    if (!job) return {status: false, reason: 'job not found'};
    try {
        job.addMessage(user, body.message);
    } catch (error) {
        console.log('error!: ' + error);
    }
    return {status: true, job};
};

module.exports = {
    modify,
    newJob,
    login,
    findJob,
    uploadImage,
    findUser,
    allJobs,
    pairJob,
    offerDeal,
    rejectJob,
    sendMessage,
};


