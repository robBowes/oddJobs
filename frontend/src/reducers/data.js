export default (state = {
    cards: [],
}
, action) => {
    let newState = {...state};
    if (action.type === 'UPDATE_STACK') {
        newState.cards = action.payload;
    }
    if(action.type==='UPDATE_JOBS'){
        newState.jobs = action.payload
    }
    return newState;
};

