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
// const http = require('http').Server(app, '/messages');
const io = require('socket.io')();
const fs = require('fs');
const https = require('https');

// let credentials = {key: privateKey, cert: certificate};
// let httpsServer = https.createServer(credentials, app);

const Schemas = require('./Shemas.js');
const User = Schemas.User;
const Job = Schemas.Job;

mongoose.connect(r.uri, {autoIndex: false});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('connected to mongoose server');
});

const userFromToken = r.findToken(User);
const createNewJob = oddJobs.newJob(Job, User);
const findJob = oddJobs.findJob(Job, User);
const findUser = oddJobs.findUser(User);
const allJobs = oddJobs.allJobs(Job, User);
const pairJob = oddJobs.pairJob(Job, User);
const login = oddJobs.login(Job, User);
const makeDeal = oddJobs.offerDeal(Job, User);
const rejectJob = oddJobs.rejectJob(Job, User);
const sendMessage = oddJobs.sendMessage(Job, User);
const completeJob = oddJobs.completeJob(Job, User);
const backOut = oddJobs.backOut(Job, User);
const modify = oddJobs.modify(Job, User);

const verbose = (obj) => {
    if (false)console.log(obj);
};

let privateKey = fs.readFileSync('privkey.pem', 'utf8');
let certificate = fs.readFileSync('fullchain.pem', 'utf8');
let credentials = {key: privateKey, cert: certificate};
let httpsServer = https.createServer(credentials, app);

// app.use(express.json({type: 'application/json'}));
app.use(bodyParser.raw({type: 'image/*', limit: '12mb'}));
app.use(express.json({type: '*/*'}));
app.use(cookieParser());
app.use(express.static('data/images'));
app.use(express.static('../frontend/build'));


app.post('/login', async (req, res)=>{
    // console.log('$$$$$$$$$$$'+req);
    let ret = {status: true};
    try {
        let fb = req.body;
        let appToken = req.cookies.token;
        if (appToken) {
            ret.user = await userFromToken(req.cookies.token);
            if (ret.user) ret.user = await oddJobs.deepUser(Job, ret.user, User );
        }
        if (!ret.user) ret = await login(fb, req.cookies.token, User, ret.user);
        if (ret.status) res.cookie('token', ret.user.appToken);
        verbose('User: logs in');
    } catch (error) {
        console.log(error);
        ret = {status: false, reason: error};
    }
    if (!ret.status) console.log(ret.reason);
    // res.cookie('token', ret.user.appToken);
    // res.cookie('token', '12345');
    // ret.user = await oddJobs.deepUser(Job, ret.user, User);
    res.json(ret);
});

app.put('/modify', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' requests modify');
    let reply = await modify(user, req.body);
    if (!reply.status) console.log(reply.reason);
    res.json(reply);
});

app.post('/allJobs', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' requests allJobs');
    let reply = await allJobs(user, req.body.location);
    if (!reply.status) console.log('all jobs request failed: ' + reply.reason);
    if (!reply.status) console.log(reply.reason);
    res.json(reply);
});

app.put('/pair', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' makes a pair');
    let job = await pairJob(user, req.body);
    if (!job.status) console.log('pair failed: '+ job.reason);
    if (!job.status) console.log(job.reason);
    res.json(job);
});

app.put('/deal', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' makes a deal');
    let job = await makeDeal(user, req.body);
    if (!job) throw new Error('error on deal');
    if (!job.status) console.log('Deal failed: ' + job.reason);
    if (!job.status) console.log(job.reason);
    res.json(job);
});

app.put('/completeJob', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + 'completes a job');
    let reply = await completeJob(user, req.body);
    if (!reply.status) console.log(reply.reason);
    res.json(reply);
});

app.put('/rejectJob', async (req, res)=>{
    try {
        let user = await userFromToken(req.cookies.token);
        verbose(user?user.name:null + ' rejects a job');
        let ret = await rejectJob(user, req.body.id);
        if (!ret.status) console.log('Reject job failed: ' + ret.reason);
        res.json(ret);
    } catch (error) {
        console.log(error);
    }
});

app.put('/addJob', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' requests allJobs');
    let job = await createNewJob(user, req.body);
    if (!job.status) console.log('add job failed: ' + job.reason);
    if (!job.status) console.log(job.reason);
    res.json(job);
});

app.post('/user', async (req, res)=>{
    let ret;
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' requests user information');
    if (user && user.id ===req.body.id) {
        ret = {status: true, user: await oddJobs.deepUser(Job, user, User)};
    } else ret = await findUser(req.body);
    if (!ret.status) console.log(ret.reason);
    res.json(ret);
});

app.post('/job', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    verbose(user?user.name:null + ' job');
    let ret = await findJob(req.body, user);
    if (!ret.status) console.log(ret.reason);
    res.json(ret);
});

app.put('/sendMessage', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    try {
        verbose(user?user.name:null + ' sends a message');
    } catch (error) {
        console.log(error);
    }
    let reply = await sendMessage(user, req.body);
    if (!reply.status) console.log(reply.reason);
    res.json(reply);
});

app.put('/uploadImage', (req, res)=>{
    let ret = oddJobs.uploadImage(req);
    verbose('upload image ' + ret.status?ret.name:null);
    res.json(ret);
});

app.put('/backOut', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    let reply = await backOut(user, req.body);
    res.json(reply);
});

io.on('connection', function(client) {
    console.log('a user connected');
    client.on('messages', (a)=>{
        console.log('user subscribed to messages');
        console.log(a);
        setInterval(() => {
            client.emit('timer', new Date());
        }, 1000);
    });

    client.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// io.emit('some event', {for: 'everyone'});

app.put('*', (req, res)=>{
    console.log('unhandled request');
    app.json({status: false, reason: 'unhandled request'});
});
app.post('*', (req, res)=>{
    console.log('unhandled request');
    app.json({status: false, reason: 'unhandled request'});
});

io.listen(8000);
app.listen(4000, ()=>{
    console.log('app listening on port 4000...');
});

httpsServer.listen(443)
;
