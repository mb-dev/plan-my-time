import React from 'react';

require('./footer.less');

export default class Header extends React.Component {
  render() {
    return (
      <footer>
        plot-my-trip is open source and work in progress. Contribute on Github: <a href="https://github.com/mb-dev/plot-my-trip">https://github.com/mb-dev/plot-my-trip</a>.
      </footer>
    )
  }
}
