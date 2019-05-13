import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
    isAuthenticated: false,
    token: '',
    errorMessage: '',
    signInError: false,
    signUpError: false,
    registerSuccess: false,
    name: '',
    tokenSuccess: false
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
                registerSuccess: false,
                name: action.name
            }
        case actionTypes.AUTH_SIGN_UP:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: false,
                errorMessage: '',
                signUpError: false,
                registerSuccess: true
            }
        case actionTypes.AUTH_SIGN_IN_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: action.payload,
                signInError: true,
                registerSuccess: false
            }
        case actionTypes.AUTH_SIGN_UP_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: action.payload,
                signUpError: true,
                registerSuccess: false
            }
        case actionTypes.TOKEN_ACCESS:
            return {
                ...state,
                name: action.name,
                tokenSuccess: true
            }
        case actionTypes.TOKEN_ERROR:
            return {
                ...state,
                name: '',
                tokenSuccess: false
            }
        default:
            return state;

    }
}

export default reducer;