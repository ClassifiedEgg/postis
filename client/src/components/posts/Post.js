import React, { useEffect, useState, Fragment } from 'react'
import {
    EuiFlexGrid,
    EuiFlexGroup,
    EuiTitle,
    EuiLoadingSpinner,
    EuiText,
    EuiFieldText,
    EuiIcon,
    EuiSpacer,
    EuiButton,
    EuiFlexItem,
    EuiButtonEmpty,
    EuiOverlayMask,
    EuiConfirmModal
} from '@elastic/eui';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPost, addComment, deletePost } from "../../actions/posts";
import PostComment from './PostComment'
import { Link, Redirect } from 'react-router-dom';

const Post = ({ loading, post, getPost, addComment, deletePost, auth: { isAuthenticated, user }, match: { params } }) => {

    useEffect(() => {
        getPost(params.postid)
    }, [getPost])

    const [showModal, setShowModal] = useState(false)

    let destroyModal;

    if (showModal) {
        destroyModal = (
            <EuiOverlayMask>
                <EuiConfirmModal
                    title="Delete Comment"
                    onCancel={() => { setShowModal(false) }}
                    onConfirm={() => {
                        deletePost(params.postid)
                        setShowModal(false)
                    }}
                    cancelButtonText="No, don't do it"
                    confirmButtonText="Yes, do it"
                    buttonColor="danger"
                    defaultFocusedButton="confirm">
                    <p>Are you sure you want to delete this post?</p>
                    <p>{post.title}</p>
                </EuiConfirmModal>
            </EuiOverlayMask>
        );
    }

    const [formData, setFormData] = useState({
        comment: ''
    })

    const onSubmit = (e) => {
        e.preventDefault()
        addComment(params.postid, formData)
        setFormData({
            comment: ''
        })
    }

    return loading || post === null ? <EuiLoadingSpinner /> : (
        <Fragment>
            <EuiFlexGrid columns={1} direction='column' style={{ margin: '2% 15%' }}>
                <EuiSpacer size='l' />
                <EuiFlexGroup alignItems='center' justifyContent='flexStart'>
                    <EuiFlexItem>
                        <EuiTitle size='l'>
                            <h1 style={{ fontWeight: '500' }}>{post.title}</h1>
                        </EuiTitle>
                    </EuiFlexItem>
                    {isAuthenticated && (user.name === post.name) &&
                        <Fragment>
                            <EuiFlexItem grow={false}>
                                <Link to={`/posts/${params.postid}/edit`}>
                                    <EuiButtonEmpty
                                        iconType="arrowDown"
                                        color='primary'
                                        iconSide="left">
                                        Edit Post
                                    </EuiButtonEmpty>
                                </Link>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiButtonEmpty
                                    onClick={() => setShowModal(true)}
                                    iconType="arrowDown"
                                    color='danger'
                                    iconSide="left">
                                    Delete Post
                                </EuiButtonEmpty>
                            </EuiFlexItem>
                        </Fragment>
                    }
                </EuiFlexGroup>
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiText grow={true}>
                            <p>By <span style={{ fontWeight: '500' }}>{post.name}</span></p>
                        </EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
                {/* <EuiSpacer size='l' /> */}
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiText>
                            {post.content}
                        </EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size='xxl' />
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiTitle size='s'>
                            <h1>Comments</h1>
                        </EuiTitle>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size='l' />
                <EuiFlexGroup gutterSize='s'>
                    <EuiFlexItem grow={9}>
                        <EuiFieldText
                            placeholder="Write a comment"
                            prepend={<EuiIcon type="editorComment" />}
                            name='comment'
                            fullWidth
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiButton fill type='submit' onClick={(e) => { onSubmit(e) }}>
                            Add Comment
                    </EuiButton>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size='xl' />
                {
                    post.comments.map((comment) => <PostComment comment={comment} postId={params.postid} />)
                }
            </EuiFlexGrid>
            {destroyModal}
        </Fragment>
    )
}

Post.propTypes = {
    post: PropTypes.object,
    getPost: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    loading: state.post.loading,
    post: state.post.post,
    auth: state.auth
})

export default connect(mapStateToProps, { getPost, addComment, deletePost })(Post)
