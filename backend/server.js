const express = require('express');
const bodyParser = require('body-parser');
const oddJobs = require('./oddJobs');
const r = require('./utils.js');
const testData = require('./testData.json');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const app = express();

const Schemas = require('./Shemas.js');
const User = Schemas.User;


mongoose.connect(r.uri, {autoIndex: false});
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('connected to mongoose server');
    // let bob = new Schemas.User(testData.testUser.bob);
    // bob.save();
    // Schemas.User.findOne({id: '5455'})
    // .then((err, data)=>{
    //     console.log(err, data);
    // });
});

// app.use(express.json({type: 'application/json'}));
app.use(express.json({type: '*/*'}));
// app.use(bodyParser.raw({type: '*/*'}));


app.post('/login', async (req, res)=>{
    let fb = req.body;
    const isValid = await r.checkFbToken(fb);
    // Users.findOne(fb.id)
    // const user = new User(fb);
    // user.save();
    let user = await User.findOne({id: fb.id});
    if (user) {
    } else {
        console.log('making new User');
        user= new User(fb);
        user.save();
    }
    console.log(user);
    res.json({status: isValid, user: user});
});

app.put('/modify', (req, res)=>{
    res.json({'status': true, 'user': testData.testUser});
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
