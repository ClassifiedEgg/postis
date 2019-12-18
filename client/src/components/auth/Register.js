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
import { registerUser } from "../../actions/auth";
import PropTypes from 'prop-types'

const Register = ({ registerUser, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const { name, email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault()
        registerUser({ name, email, password });
    }

    if (isAuthenticated) {
        return <Redirect to="/posts" />
    }

    return (
        <Fragment>
            <EuiFlexGroup>
                <EuiFlexItem>POSTIS</EuiFlexItem>
                <EuiFlexItem>
                    <EuiForm>
                        <EuiFormRow label='Username'>
                            <EuiFieldText
                                placeholder='Username'
                                name='name'
                                type='text'
                                onChange={e => onChange(e)}
                            />
                        </EuiFormRow>

                        <EuiFormRow label='Email'>
                            <EuiFieldText
                                placeholder='Email'
                                name='email'
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
                            Register
                        </EuiButton>
                    </EuiForm>
                </EuiFlexItem>
            </EuiFlexGroup>
        </Fragment>
    )
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { registerUser })(Register)
