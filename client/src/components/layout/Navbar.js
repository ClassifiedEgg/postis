import React, { Fragment } from 'react'
import {
    EuiHeader,
    EuiIcon,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderLink,
    EuiHeaderLogo,
} from '@elastic/eui';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser } from '../../actions/auth'
import PropTypes from 'prop-types'

const Navbar = ({ auth: { isAuthenticated, loading, user }, logoutUser }) => {

    const loggedIn = (
        <Fragment>
            <EuiHeaderSectionItem>
                <Link to='/posts/new' style={{ color: "black" }}>
                    <EuiHeaderLink href="/posts/new">
                        <EuiIcon type='plusInCircle' title='Make A New Post' />
                    </EuiHeaderLink>
                </Link>
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                {user && <Link to={`/users/${user.name}`}>
                    <EuiHeaderLink>
                        User
                    </EuiHeaderLink>
                </Link>}
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                <EuiHeaderLink onClick={() => { logoutUser() }}>
                    Logout
                </EuiHeaderLink>
            </EuiHeaderSectionItem>
        </Fragment>
    );

    const notLoggedIn = (
        <Fragment>
            <EuiHeaderSectionItem>
                <EuiHeaderLink href="/login">
                    Log In
                </EuiHeaderLink>
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                <EuiHeaderLink href="/register">
                    Register
                </EuiHeaderLink>
            </EuiHeaderSectionItem>
        </Fragment>
    )

    return (
        <Fragment>
            <EuiHeader>

                <EuiHeaderSection grow={true}>
                    <EuiHeaderSectionItem>
                        {
                            isAuthenticated && !loading ?
                                (<Link to='/posts'><EuiHeaderLogo>Postis</EuiHeaderLogo></Link>) :
                                (<Link to='/'><EuiHeaderLogo>Postis</EuiHeaderLogo></Link>)
                        }
                    </EuiHeaderSectionItem>
                </EuiHeaderSection>

                <EuiHeaderSection>
                    {!loading &&
                        isAuthenticated ? loggedIn : notLoggedIn
                    }
                </EuiHeaderSection>

            </EuiHeader>
        </Fragment >
    )
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(Navbar)
