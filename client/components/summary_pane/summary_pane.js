import React      from 'react';
import * as formatters from '../../libraries/formatters/formatters';

export default class SummaryPane extends React.Component {
  render() {
    return (<section className="summary-pane">
      <h2>Summary</h2>
      { this.props.summary !== undefined &&
        <ul>
          { Object.keys(this.props.summary).map((key) => { return (
            <li key={key}>{key}: {formatters.displayDuration(this.props.summary[key]['day'])}</li>
          )}) }
        </ul>
      }
    </section>);
  }
}
