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
const http = require('http').Server(app, '/messages');
const io = require('socket.io')();


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
const createNewJob = oddJobs.newJob(Job);
const findJob = oddJobs.findJob(Job);
const findUser = oddJobs.findUser(User);
const allJobs = oddJobs.allJobs(Job);
const pairJob = oddJobs.pairJob(Job);
const login = oddJobs.login(Job, User);
const makeDeal = oddJobs.offerDeal(Job);
const rejectJob = oddJobs.rejectJob(Job);
const sendMessage = oddJobs.sendMessage(Job, User);

const verbose = (obj) => {
    if (true)console.log(obj);
};

// app.use(express.json({type: 'application/json'}));
app.use(bodyParser.raw({type: 'image/*', limit: '12mb'}));
app.use(express.json({type: '*/*'}));
app.use(cookieParser());
app.use(express.static('data/images'));


app.post('/login', async (req, res)=>{
    verbose('login');
    let ret = {status: true};
    try {
        let fb = req.body;
        let appToken = req.cookies.token;
        if (appToken) ret.user = await userFromToken(req.cookies.token);
        ret = await login(fb, req.cookies.token, User, ret.user);
        if (ret.status) res.cookie('token', ret.user.appToken);
    } catch (error) {
        console.log(error);
    }
    res.json(ret);
});

app.put('/modify', async (req, res)=>{
    verbose('modify');
    let user = await userFromToken(req.cookies.token);
    let reply = await oddJobs.modify(user, req.body);
    res.json(reply);
});

app.post('/allJobs', async (req, res)=>{
    verbose('allJobs');
    let user = await userFromToken(req.cookies.token);
    let reply = await allJobs(user, req.body.location);
    if (!reply.status) console.log(reply);
    res.json(reply);
});

app.put('/pair', async (req, res)=>{
    console.log(req.body, req.cookies.token);
    let user = await userFromToken(req.cookies.token);
    if (!user) console.log('no user info');
    let job = await pairJob(user, req.body);
    if (!user) console.log(job);
    res.json(job);
});

app.put('/deal', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    let job = await makeDeal(user, req.body);
    res.json(job);
});

app.put('/completeJob', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    res.json({'status': true, 'job': testData.job});
});

try {
    app.put('/rejectJob', async (req, res)=>{
        let user = await userFromToken(req.cookies.token);
        let ret = await rejectJob(user, req.body.id);
        res.json(ret);
    });
} catch (error) {
    console.log(error);
}

app.put('/addJob', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    let job = await createNewJob(user, req.body);
    res.json(job);
});

app.post('/user', async (req, res)=>{
    let ret;
    let user = await userFromToken(req.cookies.token);
    if (user.id ===req.body.id) ret = {status: true, user: await oddJobs.deepUser(Job, user, User)};
    else ret = await findUser(req.body);
    res.json(ret);
});

app.post('/job', async (req, res)=>{
    let ret = await findJob(req.body);
    res.json(ret);
});

app.put('/sendMessage', async (req, res)=>{
    let user = await userFromToken(req.cookies.token);
    let reply = await sendMessage(user, req.body);
    res.json(reply);
});

app.put('/uploadImage', (req, res)=>{
    let ret = oddJobs.uploadImage(req);
    res.json(ret);
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
