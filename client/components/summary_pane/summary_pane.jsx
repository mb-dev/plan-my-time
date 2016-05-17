import React      from 'react';
import * as formatters from '../../../shared/client/formatters/formatters';
import classNames from 'classnames';

const SummaryTag = (props) => (
  <li key={props.key}>
    <a href="#" onClick={() => this.onClickKey(props.key, props.section)}>{props.key}</a>:{' '}
    {props.duration}
  </li>
);

export default class SummaryPane extends React.Component {
  static propTypes = {
    onClickTag: React.PropTypes.function,
    summary: React.PropTypes.object,
  }
  onClickKey(key, section, e) {
    e.preventDefault();
    if (this.props.onClickTag) {
      this.props.onClickTag(key, section);
    }
  }
  render() {
    if (this.props.summary === undefined) {
      return (<section className="summary-pane"></section>);
    }
    const dailyGoals = [
      {tag: '#meditation', daily: 2, actual: 0},
    ];
    return (
      <section className="summary-pane">
        <div><b>Goals</b></div>
        <ul className="daily-goals">
          { dailyGoals.map((goal) => {
            const className = classNames({
              'not-started': goal.actual === 0,
              started: goal.actual > 0 && goal.actual < goal.daily,
              complete: goal.actual === goal.daily,
            });
            return (
              <li className={className}>
                <span>{goal.tag}</span>
                <span>{goal.actual}</span>/<span>{goal.daily}</span>
              </li>
            );
          })}
        </ul>
        { ['tags', 'people', 'locations'].map((section) => (
          <ul key={section}>
            { Object.keys(this.props.summary[section]).map((key) => {
              const duration = formatters.displayDuration(this.props.summary[section][key].day);
              return (
                <SummaryTag section={section} key={key} duration={duration} onClick={this.onClick} />
              );
            })}
          </ul>
        ))}
      </section>
    );
  }
}
