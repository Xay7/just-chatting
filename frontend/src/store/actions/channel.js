import * as actionTypes from './actionTypes';
import axios from 'axios';

const getChannel = async id => {
    const res = await axios.get(`/channels/${id}`)
    return res;
}

export const newChannel = data => {
    return async dispatch => {
        try {

            const postres = await axios.post(`/channels`, data);

            const res = await getChannel(postres.data.id);

            dispatch({
                type: actionTypes.NEW_CHANNEL,
                channel: res.data
            })
        } catch (error) {
            dispatch({
                type: actionTypes.NEW_CHANNEL_ERROR,
            })
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
            dispatch({
                type: actionTypes.CHANGE_CHANNEL_ERROR,
            })
        }
    }
}

export const deleteChannel = id => {
    return async dispatch => {
        try {

            await axios.delete(`/channels/${id}`)

            dispatch({
                type: actionTypes.DELETE_CHANNEL,
                channel: id
            })

        } catch (error) {
            dispatch({
                type: actionTypes.DELETE_CHANNEL_ERROR,
            })
        }
    }

}
export const changeChannelData = data => {
    return async dispatch => {
        try {

            const res = await axios.put(`/channels/${data.id}`, data)

            const channel = await getChannel(data.id);

            dispatch({
                type: actionTypes.CHANGE_CHANNEL_SETTINGS,
                successMessage: res.data.success,
                oldChannel: data.id,
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

export const storeMessage = data => {
    return async dispatch => {
        try {

            await axios.put(`/channels/${data.id}/messages`, data);

        } catch (error) {
            dispatch({
                type: actionTypes.STORE_MESSAGE_ERROR,
            })
        }
    }
}

export const getChatMessages = data => {
    return async dispatch => {
        try {

            const res = await axios.get(`/channels/${data.channel_id}/messages?amount=50&skip=${data.skipMessages}`)

            dispatch({
                type: actionTypes.GET_MESSAGES,
                messages: res.data,
            })

        } catch (error) {
            dispatch({
                type: actionTypes.GET_MESSAGES_ERROR,
            })
        }
    }
}

