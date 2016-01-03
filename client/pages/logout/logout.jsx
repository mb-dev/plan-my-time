import React from 'react';
import {Link} from 'react-router'

export default class Logout extends React.Component {
  componentDidMount() {
    
  }
  render() {
    return (
      <div id="page-content">
        Logging out...
      </div>
    )
  }
}

Logout.contextTypes = {
  router: React.PropTypes.func.isRequired
}
