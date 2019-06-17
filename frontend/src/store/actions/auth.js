import axios from 'axios';
import * as actionTypes from './actionTypes';

export const signIn = data => {
    return async dispatch => {
        try {

            const res = await axios.post('http://localhost:3001/users/signin', data);

            dispatch({
                type: actionTypes.AUTH_SIGN_IN,
                username: res.data.username,
                avatar: res.data.avatar + "?" + Date.now(),
                id: res.data.id
            });

        } catch (err) {
            dispatch({
                type: actionTypes.AUTH_SIGN_IN_ERROR,
                payload: 'Invalid email or password'
            });
        }
    }
}

export const signUp = data => {
    return async dispatch => {
        try {

            const res = await axios.post('http://localhost:3001/users/signup', data);

            dispatch({
                type: actionTypes.AUTH_SIGN_UP,
                payload: res.data.token
            });

        } catch (err) {
            dispatch({
                type: actionTypes.AUTH_SIGN_UP_ERROR,
                payload: err.response.data.error
            });
        }
    }
}

export const updateAvatar = (data, id) => {
    return async (dispatch) => {
        try {

            await axios.put(`http://localhost:3001/users/${id}/avatar`, data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })

            dispatch({
                type: actionTypes.AUTH_CHANGED_AVATAR,
                avatar: `https://justchattingbucket.s3.eu-west-3.amazonaws.com/${id}`
            })

        }
        catch (err) {
            console.log("something bad happened");
        }
    }
}

export const updatePassword = (data, id) => {
    return async dispatch => {
        try {
            let res = await axios.put(`http://localhost:3001/users/${id}/password`, data);

            dispatch({
                type: actionTypes.AUTH_CHANGED_PASSWORD,
                successMessage: res.data.success
            })
        }
        catch (err) {

            const errorMessage = err.response.data.replace(/[/"]+/g, "");

            dispatch({
                type: actionTypes.AUTH_CHANGED_PASSWORD_ERROR,
                errorMessage: errorMessage
            })
        }
    }
}

export const tokenAccess = () => {
    return async dispatch => {
        try {

            const res = await axios.get('http://localhost:3001/users/chat')

            dispatch({
                type: actionTypes.TOKEN_ACCESS,
                username: res.data.username,
                chatRooms: res.data.chatRooms
            });

        }
        catch (err) {
            dispatch({
                type: actionTypes.TOKEN_ERROR
            });

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