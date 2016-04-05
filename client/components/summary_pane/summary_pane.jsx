import React      from 'react';
import actions         from '../../actions/actions';
import * as formatters from '../../libraries/formatters/formatters';

export default class SummaryPane extends React.Component {
  onClickKey(key, e) {
    this.props.onClickTag && this.props.onClickTag(key);
  }
  render() {
    if (this.props.summary === undefined) {
      return (<section className="summary-pane"></section>);
    }
    return (
      <section className="summary-pane">
        { ['tags', 'people', 'locations'].map((section) => { return
          <ul>
            { Object.keys(this.props.summary[section]).map((key) => { return 
              <li key={key}>
                <a href="#" onClick={this.onClickKey.bind(this, key)}>{key}</a>:{' '}
                {formatters.displayDuration(this.props.summary[section][key]['day'])}
              </li>
            })}
          </ul>
        })}
      </section>
    );
  }
}
