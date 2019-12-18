import React, { useState, Fragment } from 'react'
import {
    EuiTextArea,
    EuiTitle,
    EuiFieldText,
    EuiFormRow,
    EuiButton,
    EuiSpacer,
    EuiForm
} from '@elastic/eui';
import { makeNewPost } from "../../actions/posts";
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const PostForm = ({ formSubmitSuccess, makeNewPost }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const onChange = (e) => {
        return setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = e => {
        e.preventDefault()
        makeNewPost(formData);
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
                        onChange={(e) => onChange(e)}
                    />
                </EuiFormRow>

                <EuiFormRow label="The Body of your Post" fullWidth>
                    <EuiTextArea
                        fullWidth
                        placeholder='Write something'
                        name='content'
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

PostForm.propTypes = {
    makeNewPost: PropTypes.func.isRequired,
    formSubmitSuccess: PropTypes.bool,
}

const mapStateToProps = state => ({
    formSubmitSuccess: state.post.formSubmitSuccess
})

export default connect(mapStateToProps, { makeNewPost })(PostForm)
