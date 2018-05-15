const fetch = require('node-fetch');

const stringify = (obj) => JSON.stringify(obj);

const makeNewUser = (user) => {
    // console.log(user);
    return user;
};

const uri = 'mongodb+srv://user:1111@cluster0-b37en.mongodb.net/test?retryWrites=true';

const checkFbToken = async (fb) => {
    const response = await fetch('https://graph.facebook.com/v2.11/debug_token?input_token='+fb.accessToken+'&access_token=132248777635494|cf197eb7bd32b8dfab5cced1ee7e9a16');
    const json = await response.json();
    // console.log(json);
    return json.data.is_valid && json.data.user_id === fb.id;
};

module.exports = {
    stringify,
    makeNewUser,
    checkFbToken,
    uri,
};
