import React, { Fragment, useState } from 'react'
import {
    EuiFlexGroup,
    EuiTitle,
    EuiAvatar,
    EuiFlexItem,
    EuiButton,
    EuiButtonEmpty,
    EuiLoadingSpinner,
    EuiText,
    EuiOverlayMask,
    EuiConfirmModal,
    EuiFieldText
} from '@elastic/eui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { removeComment, editComment } from "../../actions/posts";

const PostComment = ({ comment, auth: { loading, user, isAuthenticated }, removeComment, editComment, postId }) => {

    const [showModal, setShowModal] = useState(false)
    const [editCommentForm, setEditCommentForm] = useState(false)
    const [formData, setFormData] = useState({
        comment: ''
    })

    let destroyModal;

    if (showModal) {
        destroyModal = (
            <EuiOverlayMask>
                <EuiConfirmModal
                    title="Delete Comment"
                    onCancel={() => { setShowModal(false) }}
                    onConfirm={() => {
                        removeComment(postId, comment._id)
                        setShowModal(false)
                    }}
                    cancelButtonText="No, don't do it"
                    confirmButtonText="Yes, do it"
                    buttonColor="danger"
                    defaultFocusedButton="confirm">
                    <p>Are you sure you want to delete this comment?</p>
                    <p>{comment.text}</p>
                </EuiConfirmModal>
            </EuiOverlayMask>
        );
    }

    return loading ? <EuiLoadingSpinner /> : (
        <Fragment>
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiAvatar size='l' name={comment.name} />
                </EuiFlexItem>
                <EuiFlexItem grow={true} >
                    <EuiFlexGroup>
                        <EuiFlexItem grow={true}>
                            <EuiTitle size='xs'>
                                <h1>{comment.name}</h1>
                            </EuiTitle>
                        </EuiFlexItem>
                        {isAuthenticated && (user.name === comment.name) &&
                            <Fragment>
                                <EuiFlexItem grow={false}>
                                    <EuiButtonEmpty
                                        onClick={() => {
                                            setFormData({ comment: comment.text })
                                            setEditCommentForm(true)
                                        }}
                                        iconType="arrowDown"
                                        color='primary'
                                        iconSide="left">
                                        Edit Comment
                        </EuiButtonEmpty>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiButtonEmpty
                                        onClick={() => { setShowModal(true) }}
                                        iconType="arrowDown"
                                        color='danger'
                                        iconSide="left">
                                        Delete Comment
                        </EuiButtonEmpty>
                                </EuiFlexItem>
                            </Fragment>
                        }
                    </EuiFlexGroup>
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            {!editCommentForm ?
                                (
                                    <EuiText>
                                        <p>{comment.text}</p>
                                    </EuiText>
                                ) : (
                                    <EuiFieldText
                                        placeholder="Write a comment"
                                        name='comment'
                                        fullWidth
                                        type='text'
                                        value={formData.comment}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                editComment(postId, comment._id, formData)
                                                setEditCommentForm(false)
                                            }
                                        }}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                    />
                                )
                            }
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
            {destroyModal}
        </Fragment>
    )
}

PostComment.propTypes = {
    auth: PropTypes.object.isRequired,
    removeComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { removeComment, editComment })(PostComment)