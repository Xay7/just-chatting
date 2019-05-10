import axios from 'axios';
import * as actionsTypes from './actionTypes';

export const signIn = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:3001/users/signin', data);

            dispatch({
                type: actionsTypes.AUTH_SIGN_IN,
                payload: res.data.token
            });

            localStorage.setItem('JWT_TOKEN', res.data.token);

        } catch (err) {
            dispatch({
                type: actionsTypes.AUTH_SIGN_IN_ERROR,
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
                type: actionsTypes.AUTH_SIGN_UP,
                payload: res.data.token
            });

            localStorage.setItem('JWT_TOKEN', res.data.token);

        } catch (err) {
            dispatch({
                type: actionsTypes.AUTH_SIGN_UP_ERROR,
                payload: 'Email is arleady in use'
            });
        }
    }
}