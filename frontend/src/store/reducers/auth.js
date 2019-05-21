import * as actionTypes from '../actions/actionTypes';
import io from 'socket.io-client';

const DEFAULT_STATE = {
    isAuthenticated: false,
    token: '',
    errorMessage: '',
    signInError: false,
    signUpError: false,
    registerSuccess: false,
    name: '',
    tokenSuccess: false,
    chatRooms: [],
    socket: io('http://localhost:3001'),
    room: ''
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
                name: action.name,
                chatRooms: action.chatRooms,
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
                isAuthenticated: true,
                tokenSuccess: true,
                chatRooms: action.chatRooms
            }
        case actionTypes.TOKEN_ERROR:
            return {
                ...state,
                name: '',
                isAuthenticated: false,
                tokenSuccess: false
            }
        case actionTypes.CHANGE_ROOM:
            return {
                ...state,
                room: action.room
            }
        default:
            return state;

    }
}

export default reducer;