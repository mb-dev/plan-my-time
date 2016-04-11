require('./index.less');

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import storage     from './libraries/storage/storage';

import App             from './pages/app/app';
import Logout          from './pages/logout/logout';
import DropboxCallback from './pages/dropbox_callback/dropbox_callback';
import Home            from './pages/home/home';
import Report          from './pages/report/report';
import TagsPage        from './pages/tags/tags';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="logout" component={Logout} />
      <Route path="report" component={Report} />
      <Route path="tags" component={TagsPage} />
      <Route path="auth/dropbox/callback" component={DropboxCallback} />
      <IndexRoute component={Home} />
    </Route>
  </Router>
), document.getElementById('app'));

// save cookie
storage.extendBearerToken();
