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


mongoose.connect(r.uri, {autoIndex: false});
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('connected to mongoose server');
});


const findUser = r.findToken(User);

// app.use(express.json({type: 'application/json'}));
app.use(express.json({type: '*/*'}));
// app.use(bodyParser.raw({type: '*/*'}));
app.use(cookieParser());


app.post('/login', async (req, res)=>{
    let fb = req.body;
    const isValid = r.checkFbToken(fb);
    let appToken = req.cookies.token;
    let user = await findUser(appToken);
    if (user && user.appToken === appToken) {
        // console.log('user token found!');
    } else if (await isValid) {
        // console.log('finding user by id in database');
        user = await User.findOne({id: fb.id});
        appToken = sha1(Date.now());
    }
    if (!user) {
        // console.log('making new User');
        user = new User(fb);
        appToken = sha1(Date.now());
    }
    if (user) {
        user.appToken = appToken;
        user.save();
    }
    res.cookie('token', appToken);
    res.json({status: isValid, user: user});
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

app.put('/addJob', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
});

app.post('/user', (req, res)=>{
    res.json({'status': true, 'user': testData.testUser});
});

app.post('/job', (req, res)=>{
    res.json({'status': true, 'job': testData.job});
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
