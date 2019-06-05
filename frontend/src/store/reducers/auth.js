import * as actionTypes from '../actions/actionTypes';
import io from 'socket.io-client';

const DEFAULT_STATE = {
    isAuthenticated: false,
    errorMessage: '',
    registerSuccess: false,
    username: '',
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
                registerSuccess: false,
                username: action.username,
                avatar: action.avatar
            }
        case actionTypes.AUTH_SIGN_UP:
            return {
                ...state,
                isAuthenticated: false,
                errorMessage: '',
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
        case actionTypes.AUTH_CHANGED_AVATAR:
            return {
                ...state,
                avatar: action.avatar
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
        case actionTypes.CLEAR_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: ''
            }
        default:
            return state;

    }
}

export default reducer;