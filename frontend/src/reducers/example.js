export default (state = {
    default: 'default',
}
, action) => {
    let newState = {...state};
    if (action.type === 'ACTION') {
        newState.data === action.payload;
    }
    return newState;
};

