import axios from 'axios'
import {
    FOLLOW_USER,
    UNFOLLOW_USER,
    GET_USER_DETAILS,
    USER_ERROR,
    EDIT_USER
} from "./types";
import history from '../history'

export const getUserDetails = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/users/${id}`)

        dispatch({
            type: GET_USER_DETAILS,
            payload: res.data
        })

    } catch (err) {
        dispatch({ type: USER_ERROR })
        console.error(err.message)
    }
}

export const editUser = (id, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const res = await axios.put(`/api/users/${id}/edit`, formData, config);

        dispatch({
            type: EDIT_USER,
            payload: res.data
        })
        dispatch(getUserDetails(id))
        history.push(`/users/${id}`)
    } catch (err) {
        dispatch({ type: USER_ERROR })
        console.error(err.message)
    }
}

export const followUser = (id) => async dispatch => {
    try {
        const res = await axios.put(`/api/users/${id}/follow`)

        dispatch({
            type: FOLLOW_USER,
            payload: res.data
        })
    } catch (err) {
        dispatch({ type: USER_ERROR })
        console.error(err.message)
    }
}

export const unfollowUser = (id) => async dispatch => {
    try {
        const res = await axios.put(`/api/users/${id}/unfollow`)

        dispatch({
            type: UNFOLLOW_USER,
            payload: res.data
        })
    } catch (err) {
        dispatch({ type: USER_ERROR })
        console.error(err.message)
    }
}