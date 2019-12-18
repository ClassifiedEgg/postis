// React
import React, { Fragment, useEffect } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from './history'
import '@elastic/eui/dist/eui_theme_light.css';
import PrivateRoute from './components/routing/PrivateRoute'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Navabr from './components/layout/Navbar'
import Posts from './components/posts/Posts'
import PostForm from './components/posts/PostForm'
import PostEdit from './components/posts/PostEdit'
import User from './components/user/User'
import UserEdit from './components/user/UserEdit'
import Post from './components/posts/Post'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken'
import { loadUser } from './actions/auth';

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router history={history}>
        <Fragment>
          <Navabr />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/users/:name" component={User} />
            <PrivateRoute exact path="/users/:name/edit" component={UserEdit} />
            <PrivateRoute
              exact
              path="/posts"
              component={Posts}
            />
            <PrivateRoute
              exact
              path="/posts/new"
              component={PostForm}
            />
            <PrivateRoute
              exact
              path="/posts/:postid/edit"
              component={PostEdit}
            />
            <Route exact path='/posts/:postid' component={Post} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
