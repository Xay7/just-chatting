import axios from 'axios';
import * as actionTypes from './actionTypes';

export const signIn = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:3001/users/signin', data);

            dispatch({
                type: actionTypes.AUTH_SIGN_IN,
                payload: res.data.token,
                username: res.data.username,
                avatar: res.data.avatar + "?" + Date.now()
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

export const updateAvatar = (data, username) => {
    return async (dispatch) => {
        try {

            await axios.put(`http://localhost:3001/users/${username}/avatar`, data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })

            dispatch({
                type: actionTypes.AUTH_CHANGED_AVATAR,
                avatar: `https://justchattingbucket.s3.eu-west-3.amazonaws.com/Xay?` + Date.now()
            })


        }
        catch (err) {
            console.log("something bad happened");
        }
    }
}

export const updatePassword = data => {
    return async () => {
        try {

            await axios.put(`http://localhost:3001/users/${data.username}/password`, data);

        }
        catch (err) {
            console.log("something bad happened");
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

export const clearErrorMessage = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.CLEAR_ERROR_MESSAGE
        })
    }
}