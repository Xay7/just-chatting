import * as actionTypes from '../actions/actionTypes';
import socket from '../../SocketClient';
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
  updateRooms: false,
  channelDescription: '',
  roomOwner: '',
  errorMessage: '',
  successMessage: '',
  changedRoom: false,
  loading: false,
  skip: 0,
  noMessages: false,
};

const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_ROOMS:
      return {
        ...state,
        chatRooms: action.chatRooms,
      };
    case actionTypes.GET_ROOMS_ERROR:
      return {
        ...state,
      };
    case actionTypes.NEW_ROOM:
      return {
        ...state,
        chatRooms: [...state.chatRooms, action.room],
      };
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
        loading: false,
      };
    case actionTypes.CHANGE_ROOM_UI:
      return {
        ...state,
        changedRoom: false,
      };
    case actionTypes.JOIN_ROOM:
      return {
        ...state,
        chatRooms: [...state.chatRooms, action.room],
        errorMessage: '',
      };
    case actionTypes.JOIN_ROOM_ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage,
        successMessage: '',
      };
    case actionTypes.DELETE_ROOM:
      const rooms = state.chatRooms.filter((el) => {
        return el.id !== action.room;
      });
      return {
        ...state,
        chatRooms: rooms,
        channels: [],
        roomName: '',
        roomID: '',
        channelDescription: '',
        updateRooms: true,
      };
    case actionTypes.GET_MESSAGES:
      let noMessage = false;
      let reverse = [];
      let updatedSkip = null;

      if (action.messages.length === 0) {
        return {
          ...state,
          noMessages: true,
          loading: false,
        };
      } else {
        noMessage = false;
        reverse = action.messages.reverse();
        updatedSkip = state.skip + 50;
      }
      return {
        ...state,
        messages: [...reverse, ...state.messages],
        skip: updatedSkip,
        noMessages: noMessage,
        loading: false,
      };
    case actionTypes.NEW_CHANNEL:
      return {
        ...state,
        channels: [...state.channels, action.channel],
      };
    case actionTypes.CHANGE_CHANNEL:
      return {
        ...state,
        channelID: action.channelID,
        channelName: action.channelName,
        channelDescription: action.description,
        messages: [],
        skip: 0,
      };
    case actionTypes.CHANGE_CHANNEL_SETTINGS:
      const updatedChannels = state.channels.map((el) => {
        if (el.id === action.oldChannel) {
          el.name = action.channelName;
          return el;
        } else return el;
      });
      return {
        ...state,
        channels: updatedChannels,
        errorMessage: '',
        successMessage: action.successMessage,
        channelDescription: action.channelDescription,
        channelName: action.channelName,
      };
    case actionTypes.CHANGE_CHANNEL_SETTINGS_ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage,
        successMessage: '',
      };
    case actionTypes.DELETE_CHANNEL:
      const channels = state.channels.filter((el) => {
        return el.id !== action.channel;
      });
      return {
        ...state,
        channels: channels,
      };
    case actionTypes.LEAVE_ROOM:
      const updatedRooms = state.chatRooms.filter((el) => {
        return el.id !== action.room;
      });
      return {
        ...state,
        chatRooms: updatedRooms,
        channels: [],
        roomName: '',
        roomID: '',
        channelDescription: '',
        updateRooms: true,
      };
    case actionTypes.CLEAR_FETCH_MESSAGE:
      return {
        ...state,
        errorMessage: '',
        successMessage: '',
      };
    case actionTypes.IS_FETCHING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.SAVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case actionTypes.USERS_LIST:
      return {
        ...state,
        members: action.members,
        loading: false,
      };
    case actionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    default:
      return state;
  }
};

export default reducer;
