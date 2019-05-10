import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
    isAuthenticated: false,
    token: '',
    errorMessage: ''
}

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SIGN_IN:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
                errorMessage: ''
            }
        case actionTypes.AUTH_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}

export default reducer;