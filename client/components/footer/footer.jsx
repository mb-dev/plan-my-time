import React from 'react';

require('./footer.less');

export default class Header extends React.Component {
  render() {
    return (
      <footer>
        plan-my-time is open source and work in progress. Contribute on Github: <a href="https://github.com/mb-dev/plan-my-time">https://github.com/mb-dev/plan-my-time</a>.
      </footer>
    )
  }
}
