import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
    isAuthenticated: false,
    token: '',
    errorMessage: '',
    signInError: false,
    signUpError: false
}

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SIGN_IN:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
                errorMessage: '',
                signInError: false,
            }
        case actionTypes.AUTH_SIGN_UP:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: false,
                errorMessage: '',
                signUpError: false
            }
        case actionTypes.AUTH_SIGN_IN_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: action.payload,
                signInError: true
            }
        case actionTypes.AUTH_SIGN_UP_ERROR:
            console.log("test");
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: action.payload,
                signUpError: true
            }
        default:
            return state;
    }
}

export default reducer;