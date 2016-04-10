import React      from 'react';
import actions         from '../../actions/actions';
import * as formatters from '../../../shared/client/formatters/formatters';

export default class SummaryPane extends React.Component {
  onClickKey(key, section, e) {
    this.props.onClickTag && this.props.onClickTag(key, section);
  }
  render() {
    if (this.props.summary === undefined) {
      return (<section className="summary-pane"></section>);
    }
    return (
      <section className="summary-pane">
        { ['tags', 'people', 'locations'].map((section) => { return (
          <ul key={section}>
            { Object.keys(this.props.summary[section]).map((key) => { return (
              <li key={key}>
                <a href="#" onClick={this.onClickKey.bind(this, key, section)}>{key}</a>:{' '}
                {formatters.displayDuration(this.props.summary[section][key]['day'])}
              </li>
              )})}
          </ul>
        )})}
      </section>
    );
  }
}
