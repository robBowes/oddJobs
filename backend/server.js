const express = require('express');
const bodyParser = require('body-parser');
const oddJobs = require('./oddJobs');

const app = express();

app.use(express.json({type: 'application/json'}));
// app.use(bodyParser.raw({type: '*/*'}));

app.post('*', (req, res)=>{
    console.log(req.body.test);
    res.send();
});

app.listen(4000, ()=>{
    console.log('app listening on port 4000...');
});
