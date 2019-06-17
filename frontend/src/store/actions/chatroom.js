import * as actionTypes from './actionTypes';
import axios from 'axios';

const getRooms = async (id) => {
    const res = await axios.get(`http://localhost:3001/users/${id}/chatrooms`);
    return res;
}

const getRoom = async id => {
    const res = await axios.get(`http://localhost:3001/chatrooms/${id}`);
    return res;
}

export const updateRooms = (id) => {
    return async dispatch => {
        try {
            const res = await getRooms(id);
            dispatch({
                type: actionTypes.GET_ROOMS,
                chatRooms: res.data.chatRooms
            })
        } catch (err) {
            dispatch({
                type: actionTypes.GET_ROOMS_ERROR
            })
        }
    }
}

export const newChatroom = name => {
    return async dispatch => {
        try {

            const res = await axios.post(`http://localhost:3001/chatrooms/`, { name });

            dispatch({
                type: actionTypes.NEW_ROOM,
                room: {
                    id: res.data.id,
                    name: res.data.name
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}

export const changeRoom = id => {
    return async dispatch => {
        try {
            const res = await getRoom(id);
            dispatch({
                type: actionTypes.CHANGE_ROOM,
                roomID: res.data.id,
                roomName: res.data.name,
                channelName: '',
                channels: res.data.channels,
                members: res.data.members,
                roomOwner: res.data.owner
            });
        } catch (error) {

        }

    }
}

export const changedRoomUI = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.CHANGE_ROOM_UI
        })
    }
}

export const joinRoom = data => {
    return async dispatch => {
        try {

            const res = await axios.put(`http://localhost:3001/chatrooms/${data.id}`, data);

            dispatch({
                type: actionTypes.JOIN_ROOM,
                room: res.data
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}

export const deleteRoom = data => {
    return async dispatch => {
        try {

            await axios.delete(`http://localhost:3001/chatrooms/${data.id}`);

            const res = await getRooms(data.username);

            dispatch({
                type: actionTypes.DELETE_ROOM,
                chatRooms: res.data.chatRooms
            });

        } catch (err) {
            console.log(err);
        }
    }
}