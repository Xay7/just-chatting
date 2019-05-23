import axios from 'axios';
import * as actionTypes from './actionTypes';

export const signIn = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:3001/users/signin', data);

            localStorage.setItem('JWT_TOKEN', res.data.token);

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

            localStorage.setItem('JWT_TOKEN', res.data.token);

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

            const token = localStorage.getItem('JWT_TOKEN');

            const res = await axios.get('http://localhost:3001/users/chat', {
                headers: {
                    'authorization': token
                }
            })

            dispatch({
                type: actionTypes.TOKEN_ACCESS,
                name: res.data.name,
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
