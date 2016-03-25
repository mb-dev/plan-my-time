require('./index.less');

import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import dispather   from './dispatcher/dispatcher.js';

import App             from './pages/app/app';
import Logout          from './pages/logout/logout';
import DropboxCallback from './pages/dropbox_callback/dropbox_callback';
import Home            from './pages/home/home';
import Report          from './pages/report/report';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="logout" component={Logout} />
      <Route path="report" component={Report} />
      <Route path="auth/dropbox/callback" component={DropboxCallback} />
      <IndexRoute component={Home}/>
    </Route>
  </Router>
), document.getElementById('app'));
