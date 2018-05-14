let express = require('express');
let app = express();

let MongoClient = require('mongodb').MongoClient;
// mongodb+srv://user:<PASSWORD>@cluster0-b37en.mongodb.net/test?retryWrites=true
let uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test?retryWrites=true';

let connect = MongoClient.connect(uri, (err, client)=>{
   app.get('/test', (req, res) => {
       let myObj = {name: 'Action'};
       client.db('PetHub').collection('profiles').insertOne(myObj);
       res.send(('asd'));
   });
   app.get('/findJenny', (req, res) => {
       let myObj = {name: 'Action'};
       client.db('PetHub').collection('profiles')
       .find({name: 'Action'})
       .toArray((err, result)=>{
           // console.log(result[0]._id)
           client.db('PetHub').collection('profiles')
           .find({_id: result[0]._id})
           .toArray((ERR, RESULT)=>{
               console.log(RESULT);
           });
       });
       res.send(('We found Jenny'));
   });
   app.get('/updateJenny', (req, res) => {
       let myObj = {name: 'Action'};
       client.db('PetHub').collection('profiles')
       .updateOne({name: 'Action'}, {$set:
        {name: 'StopMessingAround'}}, (err, res)=>{
           if (err) throw err;
           console.log('1 document updated');
       });
       res.send(('We assimilate Jenny'));
   });
});


// app.get('/test', async (req, res) => {
//     connect.then(client => {
//         var myObj = {name: "Thub"}
//         console.log("1")
//         client.db("PetHub").collection("profiles").insertOne(myObj)
//         res.send(("client"));
//     })
//     console.log("2")
//     .catch(err => console.log(err))
// })


// });

app.listen(3000);
