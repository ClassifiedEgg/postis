import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({ auth: { isAuthenticated, loading }, component: Component, ...rest }) => (
    < Route {...rest} render={(props) => (
        isAuthenticated && !loading ?
            (<Component {...props} />) :
            (<Redirect to="/login" />)
    )} />
)


PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(PrivateRoute)
