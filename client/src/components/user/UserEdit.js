import React, { Fragment, useEffect, useState } from 'react'
import {
    EuiForm,
    EuiFormRow,
    EuiFieldText,
    EuiDescribedFormGroup,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButton,
    EuiText,
    EuiSpacer,
    EuiTitle,
    EuiLoadingSpinner
} from '@elastic/eui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUserDetails, editUser } from '../../actions/users'

const UserEdit = ({ getUserDetails, editUser, user: { name, email, avatar, loading }, match: { params } }) => {

    useEffect(() => {
        getUserDetails(params.name)
        setFormData({
            name: name,
            email: email,
            avatar: avatar === null ? ' ' : avatar
        })
    }, [getUserDetails])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: ''
    })

    const onChange = (e) => {
        return setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        editUser(params.name, formData)

    }

    return loading ? <EuiLoadingSpinner /> : (
        <Fragment>
            <EuiSpacer size='xxl' />
            <EuiFlexGroup justifyContent='flexStart' alignItems='center' style={{ margin: '0% 20%' }}>
                <EuiTitle size='l'>
                    <h1>Edit User</h1>
                </EuiTitle>
            </EuiFlexGroup>
            <EuiFlexGroup justifyContent='flexStart' alignItems='center' style={{ margin: '0% 20%' }}>
                <EuiForm onSubmit={(e) => onSubmit(e)}>
                    <EuiDescribedFormGroup
                        idAria="username"
                        title={<h3>Username</h3>}
                        description={
                            <Fragment>
                                Sadly you can't change your username once you've set it :(
                            </Fragment>
                        }>
                        <EuiFormRow
                            label="Username">
                            <EuiFieldText
                                name="name"
                                disabled
                                value={formData['name']}
                                onChange={(e) => onChange(e)}
                            />
                        </EuiFormRow>
                    </EuiDescribedFormGroup>
                    <EuiDescribedFormGroup
                        idAria="email"
                        title={<h3>Email</h3>}
                        description={
                            <Fragment>
                                Each email can be used for only one account, so make sure that the email
                                you're using is not used by someone else on this website
                            </Fragment>
                        }>
                        <EuiFormRow
                            label="Email">
                            <EuiFieldText
                                name="email"
                                value={formData['email']}
                                onChange={(e) => onChange(e)}
                            />
                        </EuiFormRow>
                    </EuiDescribedFormGroup>
                    <EuiDescribedFormGroup
                        idAria="avatar"
                        title={<h3>Avatar</h3>}
                        description={
                            <Fragment>
                                Submit a link to an image hosted on a public server to use it as your avatar
                            </Fragment>
                        }>
                        <EuiFormRow
                            label="Avatar">
                            <EuiFieldText
                                name="avatar"
                                value={formData['avatar']}
                                onChange={(e) => onChange(e)}
                            />
                        </EuiFormRow>
                    </EuiDescribedFormGroup>
                    <EuiSpacer size='xl' />
                    <EuiButton type="submit" fill onClick={(e) => onSubmit(e)}>
                        Make Changes
                    </EuiButton>
                </EuiForm>
            </EuiFlexGroup>
        </Fragment>
    )
}

UserEdit.propTypes = {
    getUserDetails: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, { getUserDetails, editUser })(UserEdit)
