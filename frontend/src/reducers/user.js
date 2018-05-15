export default (state = {
    username: null,
    picture: null,
    id: null,
    loggedIn: false,
    welcomeStage: 0,
}
, action) => {
    console.log(state, action)
    let newState = {...state};
    if (action.type === 'USER_INFO') {
        newState.username = action.username;
        newState.picture = action.picture;
        newState.tid = action.id;
        newState.loggedIn = action.loggedIn;
    }
    if (action.type === 'INCREMENT_WELCOME'){
        newState.welcomeStage = newState.welcomeStage + 1;
    }
    if (action.type === 'WELCOME_STATE'){
        newState.welcomeStage = action.payload;
    }
    return newState;
};

