export default (state = {
    username: null,
    picture: null,
    id: null,
    loggedIn: false,
    welcomeStage: 0,
    location: {},
}
, action) => {
    let newState = {...state};
    if (action.type === 'USER_INFO') {
        newState.username = action.username;
        newState.picture = action.picture;
        newState.id = action.id;
        newState.loggedIn = action.loggedIn;
        newState.jobsListed = action.jobslisted
    }
    if (action.type === 'WELCOME_STATE') {
        newState.welcomeStage = action.payload;
    }
    if (action.type === 'USER_UPDATE') {
        newState = {...newState, ...action.payload};
        newState.loggedIn = true;
    }
    if (action.type === 'UPDATE_LOCATION') {
        newState.location.lat = action.payload.coords.latitude;
        newState.location.lng = action.payload.coords.longitude;
    }
    return newState;
};

