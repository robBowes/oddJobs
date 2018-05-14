const express = require('express');
const bodyParser = require('body-parser');
const oddJobs = require('./oddJobs');
const r = require('./utils.js');
const testData = require('./testData.json');
const fetch = require('node-fetch');


// console.log(testData);

const app = express();

// app.use(express.json({type: 'application/json'}));
app.use(express.json({type: '*/*'}));
// app.use(bodyParser.raw({type: '*/*'}));

app.post('/login', (req, res)=>{
    console.log(req.body);
    res.cookie('token', '456', {maxAge: 900000, httpOnly: false});
    // res.cookie('Set-Cookie', '243242');
    res.json({'status': true, 'user': testData.testUser});
    // res.send(req.body);
});

app.put('/register', (req, res)=>{
    console.log(req.body);
    // res.set('Set-Cookie', 12345);
    let accessToken = req.body.token;
    fetch('https://graph.facebook.com/v2.11/'+accessToken).then((res)=>res.text()).then((data)=>console.log(data));
    res.json({
        'status': true,
        'user': testData.emptyUser,
    });
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
