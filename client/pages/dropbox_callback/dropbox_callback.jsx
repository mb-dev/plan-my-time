import React from 'react';

import actions from '../../actions/actions'

export default class GoogleCallback extends React.Component {
  componentDidMount() {
    let {state, code} = this.props.query;

    if(state && code) {
      actions.finalizeDropboxAuth(state, code, this.context.router);
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

GoogleCallback.contextTypes = {
  router: React.PropTypes.func.isRequired
}
