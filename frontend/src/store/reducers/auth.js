import * as actionTypes from '../actions/actionTypes';
import io from 'socket.io-client';

const DEFAULT_STATE = {
    isAuthenticated: false,
    errorMessage: '',
    signInError: false,
    signUpError: false,
    registerSuccess: false,
    username: 'Xay',
    avatar: '',
    tokenSuccess: false,
    socket: io('http://localhost:3001')
}
const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SIGN_IN:
            return {
                ...state,
                isAuthenticated: true,
                errorMessage: '',
                signInError: false,
                registerSuccess: false,
                username: action.username,
                avatar: action.avatar
            }
        case actionTypes.AUTH_SIGN_UP:
            return {
                ...state,
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
                username: action.username,
                isAuthenticated: true,
                tokenSuccess: true,
            }
        case actionTypes.TOKEN_ERROR:
            return {
                ...state,
                username: '',
                isAuthenticated: false,
                tokenSuccess: false
            }
        default:
            return state;

    }
}

export default reducer;