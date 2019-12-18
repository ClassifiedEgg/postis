import React, { useEffect } from 'react'
import {
    EuiFlexGrid,
    EuiFlexGroup,
    EuiTitle,
    EuiLoadingSpinner,
    EuiCard,
    EuiAvatar,
    EuiButton,
    EuiSpacer,
    EuiFlexItem
} from '@elastic/eui';
import { followUser, unfollowUser, getUserDetails } from "../../actions/users";
import { withRouter, Link } from "react-router-dom";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PostCard from '../posts/PostCard'

const User = ({
    user: { loading, name, posts, followers, following, avatar },
    isAuthenticated,
    currentUser,
    match: { params },
    getUserDetails,
    followUser,
    unfollowUser
}) => {
    useEffect(() => {
        getUserDetails(params.name)
    }, [getUserDetails, params.name])

    return loading ? <EuiLoadingSpinner /> : (
        <EuiFlexGrid style={{ padding: '2% 15%' }} direction='column'>
            <EuiFlexGroup alignItems='center' justifyContent='center' style={{ margin: '1% 0%' }}>
                <EuiFlexItem grow={false}>
                    <EuiAvatar size="xl" name={avatar ? avatar : name} />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiTitle><h1>{name}</h1></EuiTitle>
                </EuiFlexItem>
                {isAuthenticated &&
                    name === currentUser.name ?
                    (< EuiFlexItem grow={false}>
                        <Link to={`/users/${name}/edit`}>
                            <EuiButton
                                color="secondary"
                                size="s"
                                fill>
                                Edit Profile
                        </EuiButton>
                        </Link>
                    </EuiFlexItem>) :
                    (< EuiFlexItem grow={false}>
                        <EuiButton
                            color="secondary"
                            size="s"
                            fill
                            onClick={() => followers.find(({ name }) => name === currentUser.name) ?
                                unfollowUser(params.name) : followUser(params.name)}>
                            {followers.find(({ name }) => name === currentUser.name) ? 'Unollow' : 'Follow'}
                        </EuiButton>
                    </EuiFlexItem>)

                }
            </EuiFlexGroup>
            <EuiFlexGroup alignItems='center' justifyContent='spaceAround' style={{ margin: '0% 20%' }}>
                <span style={{ fontSize: '1.2em' }}><strong>Posts Made: {posts.length}</strong></span>
                <span style={{ fontSize: '1.2em' }}><strong>Followers: {followers.length}</strong></span>
                <span style={{ fontSize: '1.2em' }}><strong>Following: {following.length}</strong></span>
            </EuiFlexGroup>
            <EuiSpacer size='xl' />
            <EuiFlexGroup alignItems='center' justifyContent='center'>
                <EuiTitle>
                    <h1>Posts</h1>
                </EuiTitle>
            </EuiFlexGroup>
            <EuiSpacer size='l' />
            <EuiFlexGrid columns={2} direction='column'>
                {
                    posts.map(({ _id, post }) => (
                        <PostCard post={post} key={_id} />
                    ))
                }
            </EuiFlexGrid>
        </EuiFlexGrid >
    )
}

User.propTypes = {
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    getUserDetails: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user
})

export default withRouter(connect(mapStateToProps, { getUserDetails, followUser, unfollowUser })(User))
