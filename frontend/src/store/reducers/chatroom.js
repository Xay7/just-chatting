import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
    roomID: '',
    roomName: '',
    chatRooms: {
        owned: [],
        joined: []
    },
    messages: []
}

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.GET_ROOMS:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.NEW_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.CHANGE_ROOM:
            return {
                ...state,
                roomID: action.roomID,
                roomName: action.roomName
            }
        case actionTypes.JOIN_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.DELETE_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.GET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            }
        default:
            return state;
    }
}

export default reducer;