const express = require('express');
const bodyParser = require('body-parser');
const oddJobs = require('./oddJobs');
const r = require('./utils.js');

const app = express();

app.use(express.json({type: 'application/json'}));
// app.use(bodyParser.raw({type: '*/*'}));

app.post('/login', (req, res)=>{
    res.set('Set-Cookie', 12345);
    res.json({
        status: true,
        userId: '12345',
        reason: 'Login Successful!',
      }
     );
});

app.post('/register', (req, res)=>{
    res.set('Set-Cookie', 12345);
    res.json({
        status: true,
        reason: 'Registration Successful!',
    });
});

app.post('/allJobs', (req, res)=>{
    res.json({
        status: true,
        content: {
          69769860: {
            jobName: 'Mow my lawn',
            jobDescription:
              'My grass is really long can you mow it?',
            sponsorName: 'Bobert Dobert',
            price: 60,
            sponsorId: 869868,
            listDate: 1519216899934,
          },
        },
      }
     );
});

app.listen(4000, ()=>{
    console.log('app listening on port 4000...');
});
