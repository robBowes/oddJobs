const oddJobs = require('./oddJobs');
const r = require('./utils');
const testData = require('./testData.json');
const assert = require('chai').assert;
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const Schemas = require('./Shemas.js');
const User = Schemas.User;
const Job = Schemas.Job;
const createNewJob = oddJobs.newJob(Job);

mongoose.connect(r.uri, {
    autoIndex: false,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

before(function(done) {
    db.once('open', done);
});

describe('OddJobs', function() {
    let randomString = [
        'test1', 'test2', 'test3', 'test4', 'test5',
    ][Math.floor(Math.random() * 5)];
    after(() => {
        Job.deleteMany({
            jobTitle: 'test',
        }, (err) => err ? console.log(err) : null);
    });
    let user;
    before(async ()=>{
        user = await User.findOne({
            name: 'TEST',
        });
    });
    describe('modify', () => {
        it('modifies, saves and retrieves modifications', async () => {
            await oddJobs.modify(user, {
                description: randomString,
                maxPrice: randomString,
                maxDistance: randomString,
            });
            const user2 = await User.findOne({
                name: 'TEST',
            });
            assert.equal(user.description, randomString);
        });
        it('does not modify a number field with a string', ()=>{
            reply = oddJobs.modify(user, {
                welcomeStage: randomString,
            });
            assert.isNotTrue(reply.status);
        });
    });
});


dbTests = async () => {
    reply = await oddJobs.modify(null, {
        description: randomString,
    });
    assert(reply.status === false);

    let newJob = await createNewJob(user2, {
        jobDescription: 'test',
        id: 0,
        jobTitle: 'title',
    });
    assert(newJob.job.patronId === user2.id && newJob.job.listingDate);

    newJob = await createNewJob(null, {
        jobDescription: 'test',
        id: 0,
        jobTitle: 'title',
    });
    assert(newJob.status === false && newJob.reason === 'no user found');

    newJob = await createNewJob(user2);
    assert(newJob.status === false,
        'create new job is not detecting lack of job details'
    );
};

const fetchConstructor = (cookie, method) => {
    let options = {
        headers: {cookie: cookie},
        method: method,
        credentials: 'same-origin',
    };
    return async (path, obj) => {
        let bodyStr = JSON.stringify(obj);
        options.body = bodyStr;
        let login = await fetch('http://localhost:4000'+path, {...options});
        let json = await login.json();
        return json;
    };
};
const cookie1 = 'token=test';
const cookie2 = 'token=983d23585c000312ea1a7359e49caf344a462003';
const user2Id = '110068453205089';
const postNoCookie = fetchConstructor(null, 'POST');
const putNoCookie = fetchConstructor(null, 'POST');
const postUser1 = fetchConstructor(cookie1, 'POST');
const putUser1 = fetchConstructor(cookie1, 'PUT');
const postUser2 = fetchConstructor(cookie2, 'POST');
const putUser2 = fetchConstructor(cookie2, 'PUT');

let testJobInfo = {
    jobDescription: 'test',
    jobTitle: 'test',
    location: {lat: '45', lng: '-38'},
    picture: '253200.jpg',
};

describe('Server', () => {
    let newJobId;
    describe('login', () => {
        it('calling login without cookie fails', async () => {
            let reply = await postNoCookie('/login', {id: '131200'});
            assert(!reply.status,
                'login without cookie or facebook access token should fail'
            );
        });
        it('logs in with test cookie', async () => {
            let reply = await postUser1('/login');
            assert.isTrue(reply.status, reply.reason);
            assert(reply.status && reply.user.name === 'TEST',
            'test cookie should return test user' );
            assert.isArray(reply.user.pairs, 'user pairs should be included in user object');
            assert.isArray(reply.user.jobsListed, 'user pairs should be included in user object');
        });
    });
    describe('add job', () => {
        it('returns a job on the endpoint', async () => {
            let json = await putUser1('/addJob', testJobInfo);
            newJobId = json.job.id;
            assert.isTrue(json.status, 'test add Job should succeed');
            assert(json.job.patronId && json.job.listingDate,
                'test add Job should return job'
            );
            assert.isOk(json.job.location, 'location should exist');
            assert.isOk(json.job.location.lat, 'location should exist');
            assert.isOk(json.job.location.lng, 'location should exist');
        });
        it('writes a job to the database', async () =>{
            let job = await Job.findOne({id: newJobId});
            assert.isOk(job, 'test job exists');
            assert.isOk(job.location);
        });
        it('fails when no body is entered', async () => {
            // test add job endpoint with bad data
            login = await fetch('http://localhost:4000/addJob',
            {
                method: 'PUT',
                body: JSON.stringify({}),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert(!json.status, 'test addJob should fail');
            assert(!json.job, 'test addJob should not return job');
        });
    });
    describe('find job endpoint', () => {
        it('doesn\'t return a job and gives a status false when there is '
        + 'no job id given',
        async () => {
            login = await fetch('http://localhost:4000/job',
            {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {cookie},
                credentials: 'same-origin',
            });
            json = await login.json();
            assert(!json.status, 'test /job with no jobId should fail');
            assert(json.status === false,
                'test /job with no jobId should fail with false reason'
            );
            assert(!json.job, 'test /job should not return job');
            assert(json.reason.length > 4, 'reason should be included');
        });
        it('return a test job when given the test job ID', async () => {
            // test /job with valid data
            login = await fetch('http://localhost:4000/job',
            {
                method: 'POST',
                body: JSON.stringify({
                    id: '12345',
                }),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            }).catch((e) => console.log(e));
            json = await login.json();
            assert(json.status, json.reason);
            assert(json.status === true, 'status should be true');
            assert(json.job, 'test /job should return job');
            assert(json.job.listingDate, 'jobs must have listing date');
        });
        it('returns a false status and reason when given a non existing job id',
        async () => {
            // test /job with non existing job id
            login = await fetch('http://localhost:4000/job',
            {
                method: 'POST',
                body: JSON.stringify({
                    id: '5afb702ad3049a09a0994d94',
                }),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            }).catch((e) => console.log(e));
            json = await login.json();
            assert(json.status === false,
                'should not find non existing job id'
            );
            assert(json.reason, 'failiure should include reason');
        });
    });
    describe('get user endpoint', () => {
        it('returns the test user when searching for id: 10102449795812560',
        async () => {
            login = await fetch('http://localhost:4000/user',
            {
                method: 'POST',
                body: JSON.stringify({
                    userId: '10102449795812560',
                }),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isTrue(json.status);
            assert.equal(json.user.name, 'TEST', 'Return user.name TEST');
        });
        it('returns clean information when searching for other users',
        async () => {
            login = await fetch('http://localhost:4000/user',
            {
                method: 'POST',
                body: JSON.stringify({
                    id: '10160372275430055',
                }),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isTrue(json.status, 'returned false status');
            assert.isNotOk(json.user.email,
                'returned e-mail, emails should be private'
            );
            assert.isOk(json.user.id, 'clean user has id');
            assert.isOk(json.user.picture, 'clean user has picture');
            assert.equal(json.user.name, 'Yazid Mehenni',
            'Return user.name Yazid');
        });
    });
    describe('get all jobs endpoint', ()=>{
        it('returns false when bad data is entered', async () =>{
            login = await fetch('http://localhost:4000/allJobs',
            {
                method: 'POST',
                body: JSON.stringify({
                    location: null,
                }),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isNotTrue(json.status, 'should return false status');
        });
        it('returns at least one job when good information', async () =>{
            login = await fetch('http://localhost:4000/allJobs',
            {
                method: 'POST',
                body: JSON.stringify({
                    location: {lat: '39', lng: '-94'},
                }),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isTrue(json.status, 'should return true status');
            assert.isOk(json.content, 'should include content');
            assert.isArray(json.content, 'content is array');
        });
    });
    describe('pair endpoint', () =>{
        it('returns false if not given a job ID', async () =>{
            login = await fetch('http://localhost:4000/pair',
            {
                method: 'PUT',
                body: JSON.stringify({}),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isFalse(json.status, 'should return false');
            assert.isOk(json.reason, 'should include reason');
            assert.isNotOk(json.job, 'should not include job');
        });
        it('returns false if not receiving user info', async () =>{
            login = await fetch('http://localhost:4000/pair',
            {
                method: 'PUT',
                body: JSON.stringify({id: '472999'}),
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isFalse(json.status, 'should return false');
            assert.isOk(json.reason, 'should include reason');
            assert.isNotOk(json.job, 'should not include job');
        });
        it('returns true and job with good information', async () =>{
            login = await fetch('http://localhost:4000/pair',
            {
                method: 'PUT',
                body: JSON.stringify({id: '472999'}),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isTrue(json.status, 'should return false');
            assert.isOk(json.job, 'should include reason');
            assert.isString(json.job.pairedHelpers[0], 'at least pair is present');
        });
    });
    describe('deal endpoint', () =>{
        it('returns false if not given a job ID', async () =>{
            login = await fetch('http://localhost:4000/deal',
            {
                method: 'PUT',
                body: JSON.stringify({}),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isFalse(json.status, 'should return false');
            assert.isOk(json.reason, 'should include reason');
            assert.isNotOk(json.job, 'should not include job');
        });
        it('returns false if not receiving user info', async () =>{
            login = await fetch('http://localhost:4000/deal',
            {
                method: 'PUT',
                body: JSON.stringify({id: '472999'}),
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isFalse(json.status, 'should return false');
            assert.isOk(json.reason, 'should include reason');
            assert.isNotOk(json.job, 'should not include job');
        });
        it('returns true and job when user is helper', async () =>{
            login = await fetch('http://localhost:4000/deal',
            {
                method: 'PUT',
                body: JSON.stringify({id: '472999'}),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isTrue(json.status, 'should return false');
            assert.isOk(json.job, 'should include reason');
            assert.nestedInclude(json.job.dealsOfferedByHelpers, '10102449795812560', 'at least pair is present');
        });
        it('returns true and job when user is patron', async () =>{
            login = await fetch('http://localhost:4000/deal',
            {
                method: 'PUT',
                body: JSON.stringify({id: '813985'}),
                headers: {
                    cookie,
                },
                credentials: 'same-origin',
            });
            json = await login.json();
            assert.isTrue(json.status, 'should return false');
            assert.isOk(json.job, 'should include reason');
            assert.nestedInclude(json.job.dealsOfferedByPatron, '10102449795812560', 'at least pair is present');
        });
    });
    describe('create, reject, find job as patron', ()=>{
        let jobId;
        it('creates a job', async () => {
            let reply = await putUser1('/addJob', testJobInfo);
            jobId =reply.job.id;
            assert.isTrue(reply.status, reply.reason);
            assert.isOk(jobId, 'returns job id');
        });
        it('rejects a job', async () => {
            let reply = await putUser1('/rejectJob', {id: jobId});
            assert.isTrue(reply.status, reply.reason);
        });
        it('returns a job with no patron', async () => {
            let reply = await postUser1('/job', {id: jobId});
            assert.isTrue(reply.status, reply.reason);
        });
    });
    describe('create job, user 2 pairs, both parties make a deal', ()=>{
        let jobId;
        it('creates a job', async () => {
            let reply = await putUser1('/addJob', testJobInfo);
            jobId =reply.job.id;
            assert.isTrue(reply.status, reply.reason);
            assert.isOk(jobId, 'returns job id');
        });
        it('gets accepted by user2', async () => {
            let reply = await putUser2('/pair', {id: jobId});
            assert.isTrue(reply.status, reply.reason);
            assert.equal();
        });
        it('returns a job with no patron', async () => {
            let reply = await postUser1('/job', {id: jobId});
            assert.isTrue(reply.status, reply.reason);
        });
    });
});

