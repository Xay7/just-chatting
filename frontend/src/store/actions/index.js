import * as actionTypes from "./actionTypes"

export * from "./auth"
export * from "./chatroom"
export * from "./channel"

// Utility
export const clearFetchMessage = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CLEAR_FETCH_MESSAGE,
        })
    }
}

export const isFetching = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.IS_FETCHING,
        })
    }
}
