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

const getChannels = async id => {
    const res = await axios.get(`http://localhost:3001/chatrooms/${id}/channels`)
    return res;
}

const getChannel = async id => {
    const res = await axios.get(`http://localhost:3001/channels/${id}`)
    return res;
}

export const isFetching = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.IS_FETCHING
        })
    }
}

export const updateRooms = (id) => {
    return async dispatch => {
        try {
            const res = await getRooms(id);
            dispatch({
                type: actionTypes.GET_ROOMS,
                chatRooms: res.data.chatRooms
            })
        }
        catch (err) {
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

export const newChannel = data => {
    return async dispatch => {
        try {

            const postres = await axios.post(`http://localhost:3001/channels`, data);

            const res = await getChannel(postres.data.id);

            dispatch({
                type: actionTypes.NEW_CHANNEL,
                channel: res.data
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const changeChannel = (id, name, description) => {
    return async dispatch => {
        try {
            dispatch({
                type: actionTypes.CHANGE_CHANNEL,
                channelID: id,
                channelName: "#" + name,
                description: description
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteChannel = id => {
    return async dispatch => {
        try {

            await axios.delete(`http://localhost:3001/channels/${id}`)

            dispatch({
                type: actionTypes.DELETE_CHANNEL,
                channel: id
            })

        } catch (error) {

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

export const storeMessage = data => {
    return async dispatch => {
        try {

            await axios.put(`http://localhost:3001/channels/${data.channelID}/messages`, data);

        } catch (error) {

        }
    }
}

export const getChatMessages = data => {
    return async dispatch => {
        try {

            const res = await axios.get(`http://localhost:3001/channels/${data.channelID}/messages?amount=50&skip=${data.skipMessages}`)

            dispatch({
                type: actionTypes.GET_MESSAGES,
                messages: res.data.messages,
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

export const changeChannelData = data => {
    return async dispatch => {
        try {

            const res = await axios.put(`http://localhost:3001/channels/${data.id}`, data)

            const channel = await getChannel(data.id);

            dispatch({
                type: actionTypes.CHANGE_CHANNEL_SETTINGS,
                successMessage: res.data.success,
                channelName: channel.data.name,
                channelDescription: channel.data.description
            })
        } catch (error) {
            dispatch({
                type: actionTypes.CHANGE_CHANNEL_SETTINGS_ERROR,
                errorMessage: error.response.data
            })
        }
    }
}

export const clearFetchMessage = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.CLEAR_FETCH_MESSAGE
        })
    }
}