export default (state = {
    cards: [],
    rejected: [],
}
, action) => {
    let newState = {...state};
    if (action.type === 'UPDATE_STACK') {
        newState.cards = action.payload;
    }
    if (action.type==='UPDATE_JOBS') {
        newState.jobs = action.payload;
    }
    if (action.type==='LEFT_SWIPE') {
        newState.rejected = newState.rejected.concat(action.payload);
    }
    return newState;
};

