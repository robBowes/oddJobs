export default (state = {
    username: null,
    picture: null,
    token: null
}
, action) => {
    console.log(state, action)
    let newState = {...state};
    if (action.type === 'USER_INFO') {
        newState.username = action.username;
        newState.picture = action.picture;
        newState.token = action.token;

    }
    return newState;
};

