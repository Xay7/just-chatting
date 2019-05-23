import * as actionTypes from './actionTypes';
import axios from 'axios';

const token = localStorage.getItem('JWT_TOKEN');

// TODO
// ADD DISPATCH ERRORS


const updateRooms = async () => {

    const res = await axios.get('http://localhost:3001/users/chat', {
        headers: {
            'authorization': token
        }
    });

    return res;
}


export const getRooms = () => {
    return async dispatch => {
        try {
            const res = await axios.get('http://localhost:3001/users/chat', {
                headers: {
                    'authorization': token
                }
            });
            dispatch({
                type: actionTypes.GET_ROOMS,
                chatRooms: res.data.chatRooms
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}

export const newChatroom = data => {
    return async dispatch => {
        try {

            await axios.post('http://localhost:3001/users/newchat', data);

            const res = await updateRooms();

            dispatch({
                type: actionTypes.NEW_ROOM,
                chatRooms: res.data.chatRooms
            })

        } catch (err) {
            console.log(err);
        }
    }
}

export const changeRoom = room => {
    return dispatch => {
        dispatch({
            type: actionTypes.CHANGE_ROOM,
            room: room
        });
    }
}

export const joinRoom = data => {
    return async dispatch => {
        try {

            await axios.put('http://localhost:3001/users/joinchat', data);

            const res = await updateRooms();

            dispatch({
                type: actionTypes.JOIN_ROOM,
                chatRooms: res.data.chatRooms
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
            await axios.delete('http://localhost:3001/users/deletechat', { data });

            const res = await updateRooms();

            dispatch({
                type: actionTypes.DELETE_ROOM,
                chatRooms: res.data.chatRooms
            });

        } catch (err) {
            console.log(err);
        }
    }
}
