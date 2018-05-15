const utils = require('./utils');


const modify = async (user, newProps) =>{
    Object.assign(user, newProps);
    let status = true;
    let reason = '';
    await user.save().catch((err)=>{
        status = false;
        reason = 'data rejected by database';
    });
    return {status, user, reason};
};

module.exports = {
    modify,
};
