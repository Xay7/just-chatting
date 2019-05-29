import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
    roomID: '',
    roomName: 'Sample name',
    chatRooms: {
        owned: [],
        joined: []
    },
    channels: [],
    channelID: '',
    channelName: 'Sample channel name',
    messages: [],
    showRoomOptions: false
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
                channels: action.channels,
                channelName: action.channelName
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
                channelID: action.channelID,
                channelName: action.channelName
            }
        case actionTypes.SHOW_ROOM_OPTIONS:
            return {
                ...state,
                showRoomOptions: !state.showRoomOptions
            }
        default:
            return state;
    }
}

export default reducer;