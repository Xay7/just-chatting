import axios from 'axios';
import * as actionTypes from './actionTypes';

export const signIn = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:3001/users/signin', data);

            dispatch({
                type: actionTypes.AUTH_SIGN_IN,
                payload: res.data.token,
                name: res.data.name,
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

export const tokenAccess = () => {
    return async dispatch => {
        try {

            const res = await axios.get('http://localhost:3001/users/chat')

            console.log(res);

            dispatch({
                type: actionTypes.TOKEN_ACCESS,
                name: res.data.username,
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
