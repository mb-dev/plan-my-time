import React      from 'react';

require('./progress_bar.less');

export default class ProgressBar extends React.Component {
  render() {
    let completed = +this.props.completed;
    if (completed < 0) { completed = 0; }
    if (completed > 100) { completed = 100;}
    let style = {
      width: completed + "%"
    }
    return (
      <div className="progress-wrap progress">
        <div style={style} className="progress-bar progress"></div>
      </div>
    );
  }
}
