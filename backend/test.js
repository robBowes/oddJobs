const oddJobs = require('./oddJobs');
const r = require('./utils');
const testData = require('./testData.json');
const assert = require('assert');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const Schemas = require('./Shemas.js');
const User = Schemas.User;
const Job = Schemas.Job;
const createNewJob = oddJobs.newJob(Job);

mongoose.connect(r.uri, {autoIndex: false});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    dbTests();
});

dbTests = async () =>{
    const user = await User.findOne({name: 'TEST'});
    assert(user.name==='TEST');
    let reply;
    let randomString = ['test1', 'test2', 'test3', 'test4', 'test5'][Math.floor(Math.random()*5)];

    /*
    TEST MODIFY
    */
    // test valid request
    await oddJobs.modify(user, {description: randomString, maxPrice: randomString, maxDistance: randomString});
    const user2 = await User.findOne({name: 'TEST'});
    assert(user2.description===randomString && user2.maxPrice === randomString);

    // test invalid request
    reply = oddJobs.modify(user, {welcomeStage: randomString});
    assert(!reply.status);

    // test null user
    reply = await oddJobs.modify(null, {description: randomString});
    assert(reply.status === false);

    /*

    TEST NEW JOB

    */
    let newJob = await createNewJob(user2, {jobDescription: 'test', id: 0, jobTitle: 'title'});
    assert(newJob.job.patronId===user2.id && newJob.job.listingDate);

    newJob = await createNewJob(null, {jobDescription: 'test', id: 0, jobTitle: 'title'});
    assert(newJob.status===false && newJob.reason === 'no user found');

    newJob = await createNewJob(user2);
    assert(newJob.status===false, 'create new job is not detecting lack of job details');

    Job.deleteMany({jobDescription: 'test'}, (err)=>err?console.log(err):null);

    console.log('mongo tests passed!!!');
};
(async () => {
    let cookie = 'token=test';
    let login = await fetch('http://localhost:4000/login', {method: 'POST', body: JSON.stringify({id: '131200'})});
    let json = await login.json();
    assert(!json.status, 'login without cookie or facebook access token should fail');

    login = await fetch('http://localhost:4000/login', {method: 'POST', headers: {cookie}, credentials: 'same-origin'});
    json = await login.json();
    assert(json.status && json.user.name==='TEST', 'test cookie should return test user');

    // test add job endpoint with good data
    login = await fetch('http://localhost:4000/addJob', {
        method: 'PUT',
        body: JSON.stringify({jobDescription: 'test', jobTitle: 'test', id: 0}),
        headers: {cookie},
        credentials: 'same-origin',
    });
    json = await login.json();
    assert(json.status, 'test add Job should succeed');
    assert(json.job.patronId && json.job.listingDate, 'test add Job should return job');

    // test add job endpoint with bad data
    login = await fetch('http://localhost:4000/addJob', {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: {cookie},
        credentials: 'same-origin'});
    json = await login.json();
    assert(!json.status, 'test addJob should fail');
    assert(!json.job, 'test addJob should not return job');

    // test /job endpoint
    login = await fetch('http://localhost:4000/job', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {cookie},
        credentials: 'same-origin'});
    json = await login.json();
    assert(!json.status, 'test /job with no jobId should fail');
    assert(json.status === false, 'test /job with no jobId should fail with false reason');
    assert(!json.job, 'test /job should not return job');
    assert(json.reason.length > 4, 'reason should be included');

    // test /job with valid data
    login = await fetch('http://localhost:4000/job', {
        method: 'POST',
        body: JSON.stringify({jobId: '12345'}),
        headers: {cookie},
        credentials: 'same-origin'}).catch((e)=>console.log(e));
    json = await login.json();
    assert(json.status, 'test /job should succeed');
    assert(json.status === true, 'status should be true');
    assert(json.job, 'test /job should return job');
    assert(json.job.listingDate, 'jobs must have listing date');

    // test /job with non existing job id
    login = await fetch('http://localhost:4000/job', {
        method: 'POST',
        body: JSON.stringify({jobId: '5afb702ad3049a09a0994d94'}),
        headers: {cookie},
        credentials: 'same-origin'}).catch((e)=>console.log(e));
    json = await login.json();
    assert(json.status === false, 'should not find non existing job id');
    assert(json.reason, 'failiure should include reason');

    // test /uploadImage with non existing job id
    login = await fetch('http://localhost:4000/uploadImage?ext=jpg', {
        method: 'PUT',
        body: JSON.stringify({image: '234234234'}),
        headers: {cookie},
        credentials: 'same-origin'}).catch((e)=>console.log(e));
        json = await login.json();
    assert(json.status === true, 'upload should work');
    assert(json.name, 'upload should include string');


    console.log('server tests passed!!!!');
})();
