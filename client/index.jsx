require('./index.less');

import React, { PropTypes } from 'react';
import Router, { Route, DefaultRoute, NotFoundRoute, Link } from 'react-router';

import dispather   from './dispatcher/dispatcher.js'

import userStore   from './stores/users_store'

import App             from './pages/app/app'
import Logout          from './pages/logout/logout'
import DropboxCallback from './pages/dropbox_callback/dropbox_callback'
import Home       from './pages/home/home'

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} />
    <Route name="logout" path="logout" handler={Logout} />
    <Route name="dropbox_callback" path="auth/dropbox/callback" handler={DropboxCallback} />
    <Route name="home" path="time" handler={Home} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});

userStore.loadCurrentUser();
