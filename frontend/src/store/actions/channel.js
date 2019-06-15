import * as actionTypes from './actionTypes';
import axios from 'axios';

const getChannels = async id => {
    const res = await axios.get(`http://localhost:3001/chatrooms/${id}/channels`)
    return res;
}

const getChannel = async id => {
    const res = await axios.get(`http://localhost:3001/channels/${id}`)
    return res;
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

export const deleteChannel = (roomID, channelID, username) => {
    return async dispatch => {
        try {

            await axios.delete(`http://localhost:3001/channels/${channelID}`)

            const res = await getChannels(roomID);

            dispatch({
                type: actionTypes.DELETE_CHANNEL,
                channels: res.data.channels
            })

        } catch (error) {

        }
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