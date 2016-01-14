import React from 'react';

import actions from '../../actions/actions'

export default class DropboxCallback extends React.Component {
  componentDidMount() {
    let {state, code} = this.props.location.query;

    if(state && code) {
      actions.finalizeDropboxAuth(state, code);
    }
  }
  render() {
    return (
      <div id="page-content">
        Logging in...
      </div>
    )
  }
}
