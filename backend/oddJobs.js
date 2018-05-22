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
        let patron = await findUserInner({id: job.patronId});
        job.patron = patron.user;
        return job;
    });
    userIsPatron = userIsPatron.map(async (job)=>{
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
    cleanPairs = await Promise.all(cleanPairs);
    userIsPatron = await Promise.all(userIsPatron);
    returnUser.pairs = cleanPairs;
    returnUser.jobsListed = userIsPatron;
    return returnUser;
};

const modify = async (user, newProps) =>{
    if (!user) return {status: false, reason: 'no user found'};
    Object.assign(user, newProps);
    let status = true;
    let reason = '';
    await user.save((err)=>{
        if (err) console.log(err);
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
    if (!User) return {status: false, reason: 'server error'};
    let fbIsValid;
    let newUser;
    let ret = {status: true};
    try {
        if (!user && fb) fbIsValid = r.checkFbToken(fb);
        if (!user) {
            user = await User.findOne({id: fb.id});
            if (!user) {
                user = await new User(fb);
            }
            user.appToken = sha1(Date.now());
            user.save();
        }
        newUser = await deepUser(Job, user, User);
        ret.user = newUser;
    } catch (error) {
        console.log(error);
        ret.status = false;
    }

    return ret;
};

const newJob = (Job) => async (user, jobDetails = {}) => {
    if (!user) return {status: false, reason: 'no user found'};
    let status = true;
    let reason;
    jobDetails.patronId = user.id;
    jobDetails.id = Math.floor(Math.random()*1000000).toString();
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
    if (!Job) return {status: false, reason: 'server error'};
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
    if (!User) return {status: false, reason: 'server error'};
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
    // console.log(location);
    user.location = location;
    user.save();
    let jobs = await Job.find();
    jobs = jobs.map((el)=>el.toObject());
    jobs = jobs.filter((job)=>!job.dealMade);
    jobs = jobs.filter((job)=>{
       // console.log(user.location);
        let distance = r.distanceBetween(job, user);
        let max = parseFloat(user.maxDistance)*100000;
        console.log(distance, max);
        return distance < max;
    });
    jobs = jobs.filter((job)=>{
        let jobPrice = parseInt(job.jobPay);
        let max = user.maxPrice;
        let min = user.minPrice;
        return jobPrice<=max && jobPrice>=min;
    });
    return {status: true, content: jobs};
};

const pairJob = (Job) => async (user, jobId) =>{
    if (!user) return {status: false, reason: 'no user information'};
    if (!jobId.id) return {status: false, reason: 'no job information'};
    if (!Job) return {status: false, reason: 'server error'};
    let job = await Job.findOne(jobId);
    job.addHelper(user.id);
    await job.save();
    let newUser = await deepUser(Job, user);
    return {status: true, job, user: newUser};
};

const offerDeal = (Job, User) => async (user, body) =>{
    if (!user) return {status: false, reason: 'no user information'};
    if (!body.jobId) return {status: false, reason: 'no job information'};
    let job = await Job.findOne({id: body.jobId});
    if (!job) return {status: false, reason: 'job not found'};
    if (job.patronId === user.id && !body.counterParty) {
        return {status: false, reason: 'no counterparty id'};
    }
    user.statistics.jobsAccepted++;
    await user.save();
    let jobWithDeal = await job.addDeal(user.id, body.counterParty);
    job.save((err)=>{
        if (err) console.log(err);
    });
    return {status: true, job: jobWithDeal};
};

const rejectJob = (Job) => async (user, jobId) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!jobId) return {status: false, reason: 'no job information'};
    if (!Job) return {status: false, reason: 'server error'};
    let job = await Job.findOne({id: jobId});
    if (!job) return {status: false, reason: 'job not found'};
    if (user.id ===job.patronId) {
        job.removePatron();
        return {status: true, user: await deepUser(Job, user)};
    } else await job.removeHelper(user.id);
    return {status: true, user: await deepUser(Job, user)};
};

const sendMessage = (Job, User) => async (user, body) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!body.id) return {status: false, reason: 'no job information'};
    if (!Job) return {status: false, reason: 'server error'};
    let job = await Job.findOne({id: body.id});
    if (!job) return {status: false, reason: 'job not found'};
    try {
        await job.addMessage(user, body.message, body.partner);
    } catch (error) {
        console.log('error!: ' + error);
    }
    let newUser = await deepUser(Job, user, User);
    // console.log(newUser.jobsListed[0].messages[1]);
    return {status: true, user: newUser};
};

const completeJob = (Job, User) => async (user, body) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!body) return {status: false, reason: 'no job information'};
    if (!Job) return {status: false, reason: 'server error'};
    let job;
    try {
        job = await Job.findOne({id: body.jobId});
        if (!job) return {status: false, reason: 'job not found'};
        job.complete(user.id);
        job.save((err)=>{
            if (err) console.log(err);
        });
        user.statistics.jobsCompleted++;
        user.save();
    } catch (error) {
        console.log(error);
    }
    return {status: true, job, user: await deepUser(Job, user, User)};
};

const backOut = (Job, User) => async (user, body) => {
    if (!user) return {status: false, reason: 'no user information'};
    if (!body) return {status: false, reason: 'no job information'};
    if (!Job) return {status: false, reason: 'server error'};
    try {
        job.backOut(user.id, body.id);
        job.save((err)=> {
            if (err) console.log(err);
        });
        user.backOut(body.id);
        user.save((err)=>{
            if (err) console.log(err);
        });
    } catch (error) {
        console.log(error);
        return {status: false, reason: error};
    }
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
    deepUser,
    completeJob,
    backOut,
};


