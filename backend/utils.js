const fetch = require('node-fetch');
const geolib = require('geolib');


const stringify = (obj) => JSON.stringify(obj);

const makeNewUser = (user) => {
    // console.log(user);
    return user;
};

// const uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test?retryWrites=true';
//  const uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test';

// Jordans mongo server
const uri = 'mongodb://user:1111@ds129670.mlab.com:29670/tester';

const checkFbToken = async (fb) => {
    const response = await fetch('https://graph.facebook.com/v2.11/debug_token?input_token='+fb.accessToken+'&access_token=132248777635494|cf197eb7bd32b8dfab5cced1ee7e9a16');
    let json;
    try {
        let json = await response.json();
        console.log(json);
        if (!json.data) return false;
        return json.data.is_valid && json.data.user_id === fb.id;
    } catch (error) {
        console.log(error);
    }
};

const findToken = (db) => async (token) =>{
    if (!token) return null;
    try {
        return user = await db.findOne({appToken: token});
    } catch (error) {
        console.log(error);
    }
};

const distanceBetween = (obj1, obj2) => {
    let dist;
    try {
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
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    stringify,
    makeNewUser,
    checkFbToken,
    uri,
    findToken,
    distanceBetween,
};
