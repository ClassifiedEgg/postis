import {
    ADD_COMMENT,
    REMOVE_COMMENT,
    ADD_POST,
    DELETE_POST,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    EDIT_POST,
    EDIT_COMMENT
} from "../actions/types";

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false,
            }
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            }
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false,
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                post: null,
                loading: false
            }
        case EDIT_POST:
            return {
                ...state,
                posts: state.posts.map(post => post._id === payload.postId ? payload.post : post),
                post: payload.post,
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            }
        case ADD_COMMENT:
        case REMOVE_COMMENT:
        case EDIT_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                loading: false
            }
        case UPDATE_LIKES:
            return {
                posts: state.posts.map(post => post._id === payload.postId ? { ...post, likes: payload.likes } : post),
                post: state.post._id === payload.postId ? { ...state.post, likes: payload.likes } : state.post,
                loading: false
            }
        default:
            return state;
    }
}