import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
    roomID: '',
    roomName: '',
    chatRooms: {
        owned: [],
        joined: []
    },
    channels: [],
    channelID: '',
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
                roomName: action.roomName,
                channels: action.channels
            }
        case actionTypes.JOIN_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.DELETE_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms,
                channels: []
            }
        case actionTypes.GET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            }
        case actionTypes.NEW_CHANNEL:
            return {
                ...state,
                channels: action.channels
            }
        case actionTypes.CHANGE_CHANNEL:
            return {
                ...state,
                channelID: action.channelID
            }
        default:
            return state;
    }
}

export default reducer;