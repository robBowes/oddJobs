export default (state = {
    username: null,
    picture: null,
    id: null,
    loggedIn: false
}
, action) => {
    console.log(state, action)
    let newState = {...state};
    if (action.type === 'USER_INFO') {
        newState.username = action.username;
        newState.picture = action.picture;
        newState.tid = action.id;
        newState.loggedIn = action.loggedIn

    }
    return newState;
};

