import * as actionTypes from './actionTypes';
import axios from 'axios';

const getRooms = async (id) => {
    const res = await axios.get(`/users/${id}/chatrooms`);
    return res;
}

const getRoom = async id => {
    const res = await axios.get(`/chatrooms/${id}`);
    return res;
}

export const updateRooms = (id) => {
    return async dispatch => {
        try {
            const res = await getRooms(id);
            dispatch({
                type: actionTypes.GET_ROOMS,
                chatRooms: res.data.chatrooms
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
            const res = await axios.post(`/chatrooms/`, { name });

            dispatch({
                type: actionTypes.NEW_ROOM,
                room: {
                    id: res.data.id,
                    name: res.data.name
                }
            })
        } catch (err) {
            dispatch({
                type: actionTypes.NEW_ROOM_ERROR
            })
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
            dispatch({
                type: actionTypes.CHANGE_ROOM_ERROR
            })
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

            const res = await axios.put(`/chatrooms/${data.id}`, data);

            dispatch({
                type: actionTypes.JOIN_ROOM,
                room: res.data
            });
        }
        catch (err) {
            dispatch({
                type: actionTypes.JOIN_ROOM_ERROR
            })
        }
    }
}

export const deleteChatroom = id => {
    return async dispatch => {
        try {

            await axios.delete(`/chatrooms/${id}`);

            dispatch({
                type: actionTypes.DELETE_ROOM,
                room: id
            });

        } catch (err) {
            dispatch({
                type: actionTypes.DELETE_ROOM_ERROR
            })
        }
    }
}

export const leaveChatroom = id => {
    return async dispatch => {
        try {

            await axios.patch(`/chatrooms/${id}`)

            dispatch({
                type: actionTypes.LEAVE_ROOM,
                room: id
            })

        } catch (err) {
            dispatch({
                type: actionTypes.LEAVE_ROOM_ERROR
            })
        }
    }
}