export default (state = {
    cards: [],
    rejected: [],
    loading: true,
}
, action) => {
    let newState = {...state};
    if (action.type === 'UPDATE_STACK') {
        newState.cards = action.payload;
    } else if (action.type==='UPDATE_JOBS') {
        newState.jobs = action.payload;
    } else if (action.type==='LEFT_SWIPE') {
        newState.rejected = newState.rejected.concat(action.payload);
    } else if (action.type === 'TOGGLE_LOADING') {
        newState.loading = !state.loading;
    }

    return newState;
};

