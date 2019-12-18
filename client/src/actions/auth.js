import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    USER_LOADED,
    AUTH_ERROR,
    CLEAR_PROFILE
} from "../actions/types";

import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get("/api/auth")

        dispatch({ type: USER_LOADED, payload: res.data })
    } catch (err) {
        dispatch({ type: AUTH_ERROR })
        console.error(err.message)
    }
};

// Register User
export const registerUser = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ name, email, password })

    try {
        const res = await axios.post("/api/users", body, config)

        dispatch({ type: REGISTER_SUCCESS, payload: res.data })

        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors)

        // if (errors) {
        //     errors.forEach(error => dispatch(setAlert(error.msg, "danger")))
        // }

        dispatch({ type: REGISTER_FAIL })
    }
};

// Login User
export const loginUser = ({ name, password }) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ name, password })

    try {
        const res = await axios.post("/api/auth", body, config)

        dispatch({ type: LOGIN_SUCCESS, payload: res.data })

        dispatch(loadUser())
    } catch (err) {
        const errors = err.response;
        console.log(errors)

        // if (errors) {
        //     errors.forEach(error => dispatch(setAlert(error.msg, "danger")))
        // }

        dispatch({ type: LOGIN_FAIL })
    }
};

// Logout User
export const logoutUser = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: LOGOUT })
};