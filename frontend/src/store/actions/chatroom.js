import * as actionTypes from './actionTypes';
import axios from 'axios';
import socket from 'SocketClient';

export const getRooms = async (id) => {
  const res = await axios.get(`/users/${id}/chatrooms`);
  return res;
};

export const getRoom = async (id) => {
  const res = await axios.get(`/chatrooms/${id}`);
  return res;
};

export const updateRooms = (id) => {
  return async (dispatch, getState) => {
    try {
      const res = await getRooms(id);
      const roomIDs = res.data.chatrooms.map((el) => {
        return el.id;
      });
      const data = {
        user_id: getState().auth.user_id,
        username: getState().auth.username,
        avatar: getState().auth.avatar,
        roomIDs: roomIDs,
      };
      socket.emit('USER_LOGGED_IN', data);

      dispatch({
        type: actionTypes.GET_ROOMS,
        chatRooms: res.data.chatrooms,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.GET_ROOMS_ERROR,
      });
    }
  };
};

export const newChatroom = (name) => {
  return async (dispatch, getState) => {
    try {
      const res = await axios.post(`/chatrooms/`, { name });
      socket.emit('NEW_ROOM', {
        roomID: res.data.id,
        username: getState().auth.username,
        avatar: getState().auth.avatar,
        user_id: getState().auth.user_id,
      });

      dispatch({
        type: actionTypes.NEW_ROOM,
        room: {
          id: res.data.id,
          name: res.data.name,
        },
      });
    } catch (err) {
      dispatch({
        type: actionTypes.NEW_ROOM_ERROR,
      });
    }
  };
};

export const changeRoom = (id, previousRoom) => {
  return async (dispatch, getState) => {
    try {
      const res = await getRoom(id);
      socket.emit('CHANGE_ROOM', {
        previousRoom: previousRoom,
        roomID: id,
        username: getState().auth.username,
        avatar: getState().auth.avatar,
      });
      dispatch({
        type: actionTypes.CHANGE_ROOM,
        roomID: res.data.id,
        roomName: res.data.name,
        channelName: '',
        channels: res.data.channels,
        members: res.data.members,
        roomOwner: res.data.owner,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.CHANGE_ROOM_ERROR,
      });
    }
  };
};

export const changedRoomUI = () => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CHANGE_ROOM_UI,
    });
  };
};

export const joinRoom = (data) => {
  return async (dispatch, getState) => {
    try {
      const res = await axios.put(`/chatrooms/${data.id}`, data);

      socket.emit('JOIN_ROOM', {
        roomID: res.data.room.id,
        user_id: res.data.room.user_id,
        username: getState().auth.username,
        avatar: getState().auth.avatar,
      });

      dispatch({
        type: actionTypes.JOIN_ROOM,
        room: res.data,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.JOIN_ROOM_ERROR,
        errorMessage: err.response.data.error,
      });
    }
  };
};

export const deleteChatroom = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/chatrooms/${id}`);

      dispatch({
        type: actionTypes.DELETE_ROOM,
        room: id,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.DELETE_ROOM_ERROR,
      });
    }
  };
};

export const leaveChatroom = (id) => {
  return async (dispatch, getState) => {
    try {
      await axios.patch(`/chatrooms/${id}`);
      socket.emit('USER_LEFT', {
        room_id: getState().chat.room_id,
        user_id: getState().auth.user_id,
      });
      dispatch({
        type: actionTypes.LEAVE_ROOM,
        room: id,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.LEAVE_ROOM_ERROR,
      });
    }
  };
};
