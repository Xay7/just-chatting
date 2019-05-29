import * as actionTypes from './actionTypes';
import axios from 'axios';

const getRooms = async (username) => {
    const res = await axios.get(`http://localhost:3001/users/${username}/chat`);
    return res;
}

const getChannels = async (username, id) => {
    const res = await axios.get(`http://localhost:3001/users/${username}/chat/${id}/channels`)
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

export const newChannel = data => {
    return async dispatch => {
        try {

            await axios.put(`http://localhost:3001/users/${data.username}/chat/${data.id}/channels`, data)

            const res = await getChannels(data.username, data.id);

            dispatch({
                type: actionTypes.NEW_CHANNEL,
                channels: res.data.channels
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const changeChannel = (id, name) => {
    return async dispatch => {
        try {
            dispatch({
                type: actionTypes.CHANGE_CHANNEL,
                channelID: id,
                channelName: "#" + name

            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const changeRoom = data => {
    return async dispatch => {
        try {

            const res = await getChannels(data.username, data.id);

            dispatch({
                type: actionTypes.CHANGE_ROOM,
                roomID: data.id,
                roomName: data.roomName,
                channels: res.data.channels,
                channelName: ''
            });
        } catch (error) {

        }

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

            await axios.delete(`http://localhost:3001/users/${data.username}/chat/${data.id}`);

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

            await axios.put(`http://localhost:3001/users/${data.author}/chat/${data.room}/channels/${data.channelID}/messages`, data);

        } catch (error) {

        }
    }
}

export const getChatMessages = data => {
    return async dispatch => {
        try {

            const res = await axios.get(`http://localhost:3001/users/${data.username}/chat/${data.roomID}/channels/${data.channelID}/messages`)

            dispatch({
                type: actionTypes.GET_MESSAGES,
                messages: res.data[0].messages
            })

        } catch (error) {
            console.log(error);
        }
    }
}

export const showRoomOptions = () => {
    return {
        type: actionTypes.SHOW_ROOM_OPTIONS,
    }
}
