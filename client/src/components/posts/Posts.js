import React, { useEffect, Fragment } from 'react'
import {
    EuiFlexGrid,
    EuiFlexGroup,
    EuiTitle,
    EuiLoadingSpinner,
    EuiText
} from '@elastic/eui';
import { connect } from 'react-redux'
import { getAllPosts } from "../../actions/posts";
import PropTypes from 'prop-types'
import PostItem from './PostItem'

const Posts = ({ post: { posts, loading }, getAllPosts }) => {

    useEffect(() => {
        getAllPosts()
    }, [getAllPosts])

    return loading || posts === null ? <EuiLoadingSpinner /> : (
        <EuiFlexGrid style={{ padding: '2% 15%' }} direction='column'>
            <EuiFlexGroup>
                <EuiTitle size='l' style={{ padding: '1% 0%' }}>
                    <h1>Posts</h1>
                </EuiTitle>
            </EuiFlexGroup>
            <EuiFlexGrid columns={1} style={{ padding: '2% 1%' }} direction='column'>
                {
                    posts.map(post => (
                        <PostItem post={post} key={post._id} />
                    ))
                }
            </EuiFlexGrid>
        </EuiFlexGrid>
    )
}

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    getAllPosts: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getAllPosts })(Posts)
