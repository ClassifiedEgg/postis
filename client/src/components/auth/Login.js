import React, { useState, Fragment } from 'react'
import { connect } from "react-redux";
import {
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiButton,
    EuiSpacer,
    EuiFlexItem,
    EuiFlexGroup,
} from '@elastic/eui';
import { Link, Redirect } from "react-router-dom";
import { loginUser } from "../../actions/auth";
import PropTypes from 'prop-types'

const Login = ({ loginUser, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        password: ""
    });

    const { name, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault()
        loginUser({ name, password });
    }

    if (isAuthenticated) {
        return <Redirect to="/posts" />
    }

    return (
        <Fragment>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiForm onSubmit={e => onSubmit(e)}>
                        <EuiFormRow label='Username'>
                            <EuiFieldText
                                placeholder='Username'
                                name='name'
                                type='text'
                                onChange={e => onChange(e)}
                            />
                        </EuiFormRow>

                        <EuiFormRow label='Password'>
                            <EuiFieldText
                                placeholder='Password'
                                name='password'
                                type="password"
                                onChange={e => onChange(e)}
                            />
                        </EuiFormRow>

                        <EuiSpacer />

                        <EuiButton type="submit" fill onClick={e => onSubmit(e)}>
                            Login
                        </EuiButton>
                    </EuiForm>
                </EuiFlexItem>
                <EuiFlexItem>POSTIS</EuiFlexItem>
            </EuiFlexGroup>
        </Fragment>
    )
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { loginUser })(Login)
