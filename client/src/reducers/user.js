import {
    GET_USER_DETAILS,
    USER_ERROR,
    FOLLOW_USER,
    UNFOLLOW_USER,
    EDIT_USER
} from '../actions/types'

const initialState = {
    posts: [],
    avatar: null,
    name: '',
    email: '',
    followers: [],
    following: [],
    loading: true
}

export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_USER_DETAILS:
            return {
                ...state,
                posts: payload.postsMade,
                name: payload.name,
                email: payload.email,
                followers: payload.followers,
                following: payload.following,
                loading: false
            }
        case FOLLOW_USER:
            return {
                ...state,
                followers: payload,
                loading: false
            }
        case UNFOLLOW_USER:
            return {
                ...state,
                followers: payload,
                loading: false
            }
        case EDIT_USER:
            return state;
        case USER_ERROR:
            return {
                ...state,
                posts: [],
                avatar: null,
                name: '',
                email: '',
                followers: [],
                following: [],
                loading: true
            }
        default:
            return state;
    }
}