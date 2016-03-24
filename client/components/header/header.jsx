import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

import store from '../../stores/store'
import storage from '../../libraries/storage/storage'
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
      currentUser: store.state.currentUser
    });
  }
  render() {
    var userSection;
    const saveButtonClass = classNames({
      'btn': true,
      'navbar-btn': true,
      'btn-primary': this.state.saveSuccessfully,
      'btn-danger': !this.state.saveSuccessfully
    });

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
              <li className="active"><Link to="home">Home <span className="sr-only">(current)</span></Link></li>
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
