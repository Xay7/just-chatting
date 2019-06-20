import * as actionTypes from '../actions/actionTypes';
// remove objects after css is done
const DEFAULT_STATE = {
    roomID: '',
    roomName: '',
    chatRooms: [],
    members: [],
    channels: [],
    channelID: '',
    channelName: '',
    messages: [],
    showRoomOptions: false,
    updateRooms: false,
    channelDescription: '',
    roomOwner: '',
    errorMessage: '',
    successMessage: '',
    changedRoom: false,
    loading: false,
    skip: 0,
    noMessages: false
}

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.GET_ROOMS:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.GET_ROOMS_ERROR:
            return {
                ...state,
            }
        case actionTypes.NEW_ROOM:
            return {
                ...state,
                chatRooms: [...state.chatRooms, action.room]
            }
        case actionTypes.CHANGE_ROOM:
            return {
                ...state,
                roomID: action.roomID,
                roomName: action.roomName,
                channels: action.channels,
                channelName: action.channelName,
                channelID: '',
                roomOwner: action.roomOwner,
                members: action.members,
                changedRoom: true,
                loading: false
            }
        case actionTypes.CHANGE_ROOM_UI:
            return {
                ...state,
                changedRoom: false
            }
        case actionTypes.JOIN_ROOM:
            return {
                ...state,
                chatRooms: [...state.chatRooms, action.room]
            }
        case actionTypes.DELETE_ROOM:
            const rooms = state.chatRooms.filter(el => {
                return el.id !== action.room
            })
            return {
                ...state,
                chatRooms: rooms,
                channels: [],
                roomName: '',
                roomID: '',
                channelDescription: '',
                updateRooms: true,
                showRoomOptions: false,
            }
        case actionTypes.GET_MESSAGES:

            let noMessage = false;
            let reverse = [];
            let updatedSkip = null;

            if (action.messages.length === 0) {
                noMessage = true;
                reverse = [];
            } else {
                noMessage = false
                reverse = action.messages.reverse();
                updatedSkip = state.skip + 50;
            }
            return {
                ...state,
                messages: reverse,
                skip: updatedSkip,
                noMessages: noMessage,
                loading: false
            }
        case actionTypes.NEW_CHANNEL:
            return {
                ...state,
                channels: [...state.channels, action.channel]
            }
        case actionTypes.CHANGE_CHANNEL:
            return {
                ...state,
                channelID: action.channelID,
                channelName: action.channelName,
                channelDescription: action.description,
                messages: [],
                skip: 0
            }
        case actionTypes.CHANGE_CHANNEL_SETTINGS:
            return {
                ...state,
                errorMessage: '',
                successMessage: action.successMessage,
                channelDescription: action.channelDescription,
                channelName: action.channelName
            }
        case actionTypes.CHANGE_CHANNEL_SETTINGS_ERROR:
            return {
                ...state,
                errorMessage: action.errorMessage,
                successMessage: ''
            }
        case actionTypes.DELETE_CHANNEL:
            const channels = state.channels.filter(el => {
                return el.id !== action.channel
            })
            return {
                ...state,
                channels: channels
            }
        case actionTypes.LEAVE_ROOM:
            const updatedRooms = state.chatRooms.filter(el => {
                return el.id !== action.room
            })
            return {
                ...state,
                chatRooms: updatedRooms,
                channels: [],
                roomName: '',
                roomID: '',
                channelDescription: '',
                updateRooms: true,
                showRoomOptions: false,
            }
        case actionTypes.SHOW_ROOM_OPTIONS:
            return {
                ...state,
                showRoomOptions: !state.showRoomOptions

            }
        case actionTypes.CLEAR_FETCH_MESSAGE:
            return {
                ...state,
                errorMessage: '',
                successMessage: ''
            }
        case actionTypes.IS_FETCHING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

export default reducer;