const utils = require('./utils');
const sha1 = require('sha1');
const r = require('./utils');

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
        !fb.accessToken) return {status: false, reason: 'no facebook data'};
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
        // console.log(error.message);
        status = false;
        reason = 'Invalid job details';
        job = null;
    }
    return {status, job, reason};
};

const findJob = (Job) => async (body) => {
    if (!body.jobId) return {status: false, reason: 'no body included'};
    const job = await Job.findOne({id: body.jobId});
    if (job) return {status: true, job};
    else return {status: false, reason: 'job could not be found'};
};

module.exports = {
    modify,
    newJob,
    login,
    findJob,
};
