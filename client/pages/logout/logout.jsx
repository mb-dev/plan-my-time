import React from 'react';
import actions         from '../../actions/actions';

export default class Logout extends React.Component {
  componentDidMount() {
    actions.logout();
  }
  render() {
    return (
      <div id="page-content">
        Logging out...
      </div>
    )
  }
}
