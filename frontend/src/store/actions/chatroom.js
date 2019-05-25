import * as actionTypes from './actionTypes';
import axios from 'axios';



// TODO
// ADD DISPATCH ERRORS


const getRooms = async (username) => {
    const res = await axios.get(`http://localhost:3001/users/${username}/chat`);
    return res;
}


export const updateRooms = (username) => {
    return async dispatch => {
        try {
            const res = await getRooms(username);
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

            await axios.post(`http://localhost:3001/users/${data.owner}/chat`, data);

            const res = await getRooms(data.owner);

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

            await axios.put(`http://localhost:3001/users/${data.username}/chat/${data.id}`, data);

            const res = await getRooms(data.username);

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

            await axios.delete(`http://localhost:3001/users/${data.username}/chat/${data.id}`, { data });

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

export const storeMessage = data => {
    return async dispatch => {
        try {

            await axios.put(`http://localhost:3001/users/${data.author}/chat/${data.room}/messages`, data);

        } catch (error) {

        }
    }
}

export const getChatMessages = data => {
    return async dispatch => {
        try {

            const res = await axios.get(`http://localhost:3001/users/${data.username}/chat/${data.room}/messages`)

            dispatch({
                type: actionTypes.GET_MESSAGES,
                messages: res.data
            })

        } catch (error) {
            console.log(error);
        }
    }
}
