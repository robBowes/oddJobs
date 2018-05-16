const utils = require('./utils');
const sha1 = require('sha1');
const r = require('./utils');
const fs = require('fs');

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

const login = async (fb, cookie, User) => {
    if (!fb.id ||
        !fb.name ||
        !fb.accessToken
    ) return {status: false, reason: 'no facebook data'};
    let fbIsValid;
    if (fb) fbIsValid = r.checkFbToken(fb);
    let user = await User.findOne({id: fb.id});
    if (!user) {
        user = new User(fb);
    }
    user.appToken = sha1(Date.now());
    user.save();
    return {status: true, user};
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
};


