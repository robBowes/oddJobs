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
        newState.id = action.id;
        newState.loggedIn = action.loggedIn;
    }
    if (action.type === 'WELCOME_STATE'){
        newState.welcomeStage = action.payload;
    }
    if (action.type === 'USER_UPDATE') {
        newState = {...newState, ...action.payload}; 
    }
    return newState;
};

