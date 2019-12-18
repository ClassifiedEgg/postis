import {
    ADD_COMMENT,
    ADD_POST,
    DELETE_POST,
    REMOVE_COMMENT,
    UPDATE_LIKES,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    EDIT_POST
} from "./types";
import history from '../history'
import axios from 'axios'

export const getAllPosts = () => async dispatch => {
    try {
        const res = await axios.get("/api/posts");

        dispatch({ type: GET_POSTS, payload: res.data })

    } catch (err) {
        dispatch({ type: POST_ERROR })
    }
}

export const getPost = (postId) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${postId}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const makeNewPost = (formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        // const body = JSON.stringify({title, content})

        const res = await axios.post("/api/posts", formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        history.push(`/posts`)
    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const deletePost = (postId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${postId}`)

        dispatch({
            type: DELETE_POST,
            payload: postId
        })

        history.push('/posts')
    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const editPost = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const res = await axios.put(`/api/posts/${postId}`, formData, config)

        dispatch({
            type: EDIT_POST,
            payload: { postId, post: res.data }
        })

        history.push(`/posts/${postId}`)
    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const likePost = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        })

    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const unlikePost = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        })

    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const res = await axios.post(`/api/posts/${postId}/comment`, formData, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}

export const removeComment = (postId, commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${postId}/comment/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

    } catch (err) {
        dispatch({ type: POST_ERROR })
        console.error(err.message)
    }
}