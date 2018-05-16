const express = require('express');
const bodyParser = require('body-parser');
const oddJobs = require('./oddJobs');
const r = require('./utils.js');
const testData = require('./testData.json');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const sha1 = require('sha1');

const Schemas = require('./Shemas.js');
const User = Schemas.User;
const Job = Schemas.Job;


mongoose.connect(r.uri, {autoIndex: false});
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('connected to mongoose server');
});


const findUser = r.findToken(User);
const createNewJob = oddJobs.newJob(Job);
const findJob = oddJobs.findJob(Job);

// app.use(express.json({type: 'application/json'}));
app.use(express.json({type: '*/*'}));
// app.use(bodyParser.raw({type: '*/*'}));
app.use(cookieParser());


app.post('/login', async (req, res)=>{
    let fb = req.body;
    let appToken = req.cookies.token;
    let ret = {status: true};
    if (appToken) ret.user = await findUser(req.cookies.token);
    if (!ret.user) ret = await oddJobs.login(fb, req.cookies.token, User);
    if (ret.status) res.cookie('token', ret.user.appToken);
    res.json(ret);
});

app.put('/modify', async (req, res)=>{
    let user = await findUser(req.cookies.token);
    let reply = await oddJobs.modify(user, req.body);
    res.json(reply);
});

app.post('/allJobs', (req, res)=>{
    res.json({'status': true, 'content': testData.job});
});

app.put('/pair', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
});

app.put('/deal', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
});

app.put('/completeJob', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
});

app.put('/rejectJob', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
});

app.put('/addJob', async (req, res)=>{
    let user = await findUser(req.cookies.token);
    let job = await createNewJob(user, req.body);
    res.json(job);
});

app.post('/user', (req, res)=>{
    res.json({'status': true, 'user': testData.testUser});
});

app.post('/job', async (req, res)=>{
    let ret = await findJob(req.body);
    res.json(ret);
});

app.put('/sendMessage', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
});

app.put('/uploadImage', (req, res)=>{
    res.json({'status': true, 'name': '234234234.jpg'});
});

app.listen(4000, ()=>{
    console.log('app listening on port 4000...');
});
