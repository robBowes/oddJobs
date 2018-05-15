const mongoose = require('mongoose');
let express = require('express');
let app = express();

let uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test?retryWrites=true';

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    // connected
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;

    const ItemSchema = new Schema({
        // id: ObjectId,
        name: String,
    });


    ItemSchema.methods.speak = function() {
        console.log('my name is ' + this.name);
    };

    const Item = mongoose.model('Item', ItemSchema);

    const chair = new Item({name: 'chair'});
    chair.speak();
    // chair.save();

    Item.find((err, items)=>{
        if (err) console.log(err);
        console.log(items);
    });
    Item.find({name: 'chair'}, (e, r)=>{
        console.log(e, r);
    });
    app.listen(4000, ()=>console.log('listening on 4000'));
});


// const instance = new MyModel();

// instance.my = 'hello';

// instance.save((err)=>{
// console.log(err?'success':err);
// });


