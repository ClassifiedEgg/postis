import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const UserRoute = ({ auth: { isAuthenticated, loading, user }, component: Component, computedMatch: { params }, ...rest }) => {
    console.log(rest)
    return (
        <Route {...rest} render={(props) => (
            isAuthenticated && !loading ?
                (<Component {...props} />) :
                (<Redirect to="/login" />)
        )} />
    )
}

UserRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(UserRoute)
