const oddJobs = require('./oddJobs');
const r = require('./utils');
const testData = require('./testData.json');
const assert = require('assert');
const mongoose = require('mongoose');


const Schemas = require('./Shemas.js');
const User = Schemas.User;


mongoose.connect(r.uri, {autoIndex: false});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    dbTests();
});

dbTests = async () =>{
    const user = await User.findOne({name: 'TEST'});
    assert(user.name==='TEST');
    let randomString = ['test1', 'test2', 'test3', 'test4', 'test5'][Math.floor(Math.random()*5)];

    // test valid request
    await oddJobs.modify(user, {description: randomString});
    const user2 = await User.findOne({name: 'TEST'});
    assert(user2.description===randomString);

    // test invalid request
    let reply = oddJobs.modify(user, {welcomeStage: randomString});
    assert(!reply.status);


    console.log('mongo tests passed');
};


// modify returns a user
// assert(oddJobs.modify(testData.mongoUser).id);
// assert(oddJobs.modify(testData.mongoUser, {description: 'test'}).description ==='test');

console.log('oddJobs tests passed!!!!');
