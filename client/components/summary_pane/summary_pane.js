import React      from 'react';
import actions         from '../../actions/actions';
import * as formatters from '../../libraries/formatters/formatters';

export default class SummaryPane extends React.Component {
  onClickKey(key, e) {
    this.props.onClickTag && this.props.onClickTag(key);
  }
  render() {
    return (<section className="summary-pane">
      <h2>Summary</h2>
      { this.props.summary !== undefined &&
        <ul>
          { Object.keys(this.props.summary).map((key) => { return (
            <li key={key}>
              <a href="#" onClick={this.onClickKey.bind(this, key)}>{key}</a>: 
              {formatters.displayDuration(this.props.summary[key]['day'])}
            </li>
          )}) }
        </ul>
      }
    </section>);
  }
}
