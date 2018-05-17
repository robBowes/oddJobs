const fetch = require('node-fetch');
const geolib = require('geolib');


const stringify = (obj) => JSON.stringify(obj);

const makeNewUser = (user) => {
    // console.log(user);
    return user;
};

// const uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test?retryWrites=true';
const uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test';

const checkFbToken = async (fb) => {
    const response = await fetch('https://graph.facebook.com/v2.11/debug_token?input_token='+fb.accessToken+'&access_token=132248777635494|cf197eb7bd32b8dfab5cced1ee7e9a16');
    const json = await response.json();
    // console.log(json);
    return json.data.is_valid && json.data.user_id === fb.id;
};

const findToken = (db) => async (token) =>{
    let user = await db.findOne({appToken: token});
    return user;
};

const distanceBetween = (obj1, obj2) => {
    return geolib.getDistance(
        {
            latitude: parseFloat(obj1.location.lat),
            longitude: parseFloat(obj1.location.lng),
        },
        {
            latitude: parseFloat(obj2.location.lat),
            longitude: parseFloat(obj2.location.lng),
        }
    );
};

module.exports = {
    stringify,
    makeNewUser,
    checkFbToken,
    uri,
    findToken,
    distanceBetween,
};
