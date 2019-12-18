import React, { useState, useEffect } from 'react'
import {
    EuiTextArea,
    EuiTitle,
    EuiFieldText,
    EuiFormRow,
    EuiButton,
    EuiSpacer,
    EuiForm
} from '@elastic/eui';
import { getPost, editPost } from "../../actions/posts";
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const PostEdit = ({ editPost, getPost, post, match: { params } }) => {

    useEffect(() => {
        getPost(params.postid)
        setFormData({ title: post.title, content: post.content })
    }, [getPost])

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const onChange = (e) => {
        return setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = e => {
        e.preventDefault()
        editPost(params.postid, formData);
    }

    return (
        <div style={{ padding: '1% 10%' }} columns={1}>
            <EuiTitle size='l' style={{ padding: '1% 0%' }}>
                <h1>Make A New Post</h1>
            </EuiTitle>

            <EuiForm>
                <EuiFormRow fullWidth label='Title'>
                    <EuiFieldText
                        fullWidth
                        placeholder='Title'
                        name='title'
                        value={formData['title']}
                        onChange={(e) => onChange(e)}
                    />
                </EuiFormRow>

                <EuiFormRow label="The Body of your Post" fullWidth>
                    <EuiTextArea
                        fullWidth
                        placeholder='Write something'
                        name='content'
                        value={formData['content']}
                        onChange={(e) => onChange(e)}
                    />
                </EuiFormRow>

                <EuiSpacer />

                <EuiButton type="submit" fill onClick={(e) => onSubmit(e)}>
                    Submit
                </EuiButton>
            </EuiForm>
        </div>
    )
}

PostEdit.propTypes = {
    editPost: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    post: state.post.post
})

export default connect(mapStateToProps, { getPost, editPost })(PostEdit)
