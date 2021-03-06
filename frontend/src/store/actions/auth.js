import axios from "axios"
import * as actionTypes from "./actionTypes"
import socket from "SocketClient"

export const signIn = (data, history) => {
    return async (dispatch) => {
        try {
            const res = await axios.post("/users/signin", data)
            dispatch({
                type: actionTypes.AUTH_SIGN_IN,
                username: res.data.username,
                avatar: res.data.avatar + "?" + Date.now(),
                id: res.data.id,
            })
            history.push("/chat")
        } catch (err) {
            dispatch({
                type: actionTypes.AUTH_SIGN_IN_ERROR,
                payload: "Invalid email or password",
            })
        }
    }
}

export const signUp = (data, history) => {
    return async (dispatch) => {
        try {
            const res = await axios.post("/users/signup", data)
            dispatch({
                type: actionTypes.AUTH_SIGN_UP,
                payload: res.data.token,
            })
            history.push("/signin")
        } catch (err) {
            dispatch({
                type: actionTypes.AUTH_SIGN_UP_ERROR,
                payload: err.response.data.error,
            })
        }
    }
}

export const updateAvatar = (data, id) => {
    return async (dispatch) => {
        try {
            await axios.put(`/users/${id}/avatar`, data, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })

            dispatch({
                type: actionTypes.AUTH_CHANGED_AVATAR,
                avatar: `https://justchattingbucket.s3.eu-west-3.amazonaws.com/${id}`,
            })
        } catch (err) {
            dispatch({
                type: actionTypes.AUTH_CHANGED_AVATAR_ERROR,
            })
        }
    }
}

export const updatePassword = (data, id) => {
    return async (dispatch) => {
        try {
            let res = await axios.put(`/users/${id}/password`, data)

            dispatch({
                type: actionTypes.AUTH_CHANGED_PASSWORD,
                successMessage: res.data.success,
            })
        } catch (err) {
            dispatch({
                type: actionTypes.AUTH_CHANGED_PASSWORD_ERROR,
                errorMessage: err.response.data.error,
            })
        }
    }
}

// Not used yet
export const tokenAccess = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get("/users/chatrooms")

            dispatch({
                type: actionTypes.TOKEN_ACCESS,
                username: res.data.username,
                chatRooms: res.data.chatRooms,
            })
        } catch (err) {
            dispatch({
                type: actionTypes.TOKEN_ERROR,
            })
        }
    }
}

export const clearFetchMessage = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CLEAR_FETCH_MESSAGE,
        })
    }
}

export const Logout = () => {
    return async (dispatch) => {
        await axios.post("/users/logout")
        socket.emit("LOGOUT")

        dispatch({
            type: actionTypes.LOGOUT,
        })
    }
}
