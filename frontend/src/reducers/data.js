export default (state = {
    cards: [],
}
, action) => {
    let newState = {...state};
    if (action.type === 'UPDATE_STACK') {
        newState.cards = action.payload;
    }
    return newState;
};

