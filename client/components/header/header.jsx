import React from 'react';
import {Link} from 'react-router';

import store from '../../stores/store';
import storage from '../../libraries/storage/storage';
import actions from '../../actions/actions';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onStoreChange = this.onStoreChange.bind(this);
  }
  handleLogin() {
    actions.authorizeWithDropbox();
  }
  onStoreChange() {
    this.updateState(this.props);
  }
  componentDidMount() {
    if (!store.state.currentUser && storage.getBearerToken()) {
      actions.getUserInfo();
    }
    store.addChangeListener(this.onStoreChange);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChange);
  }
  updateState(props) {
    this.setState({
      currentUser: store.state.currentUser,
    });
  }
  render() {
    let userSection = '';

    const links = [
      {name: 'Home', link: '/', className: window.location.pathname.length <= 1 ? 'active' : ''},
      {name: 'Report', link: '/report', className: window.location.pathname.indexOf('/report') >= 0 ? 'active' : ''},
      {name: 'Tags', link: '/tags', className: window.location.pathname.indexOf('/tags') >= 0 ? 'active' : ''},
    ];

    if (this.state.currentUser) {
      userSection = <div className="navbar-text">
        <span>Welcome {this.state.currentUser.name}</span>
        &nbsp;
        (<Link to="logout">Logout</Link>)
      </div>;
    } else {
      userSection = <a className="btn" onClick={this.handleLogin}>
        <i className="fa fa-dropbox"></i> Authorize Dropbox
      </a>;
    }
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="home">Plan My Time</Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              { links.map((link) => (
                <li className={link.className} key={link.name}>
                  <Link to={link.link}>{link.name}</Link>
                </li>
              ))}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                {userSection}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.object
}
