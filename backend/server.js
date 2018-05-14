const express = require('express');
const bodyParser = require('body-parser');
const oddJobs = require('./oddJobs');
const r = require('./utils.js');
const testData = require('./testData.json');


// console.log(testData);

const app = express();

app.use(express.json({type: 'application/json'}));
// app.use(bodyParser.raw({type: '*/*'}));

app.post('/login', (req, res)=>{
    res.set('Set-Cookie', 12345);
    console.log(req.body);
    res.json({'status': true, 'user': testData.testUser});
});

app.put('/register', (req, res)=>{
    res.set('Set-Cookie', 12345);
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
