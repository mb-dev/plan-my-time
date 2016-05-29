import React           from 'react';
import * as formatters from '../../../shared/client/formatters/formatters';
import classNames      from 'classnames';
import actions         from '../../actions/actions';
import store           from '../../stores/store';

require('./summary_pane.less');

const SummaryTag = (props) => (
  <li key={props.key}>
    <a href="#" onClick={() => this.onClickKey(props.item, props.section)}>{props.item}</a>:{' '}
    <span>{props.duration}</span>
  </li>
);

export default class SummaryPane extends React.Component {
  static propTypes = {
    onClickTag: React.PropTypes.func,
    summary: React.PropTypes.object,
    goals: React.PropTypes.array,
  }
  constructor() {
    super();
    this.onEditGoals = this.onEditGoals.bind(this);
    this.onClickKey = this.onClickKey.bind(this);
  }
  onEditGoals(e) {
    e.preventDefault();
    actions.openEditGoalsDialog(store.state.date);
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
    const dailyGoals = this.props.goals || [];
    for (const goal of dailyGoals) {
      const tagWithoutPrefix = goal.tag.substr(1);
      goal.actual = 0;
      if (this.props.summary.tags[tagWithoutPrefix]) {
        goal.actual = this.props.summary.tags[tagWithoutPrefix].dayTimes;
      }
    }
    return (
      <section className="summary-pane">
        <div>
          <b>Goals</b>
          {' '}
          <a className="edit-goal" href="" onClick={this.onEditGoals}>Edit</a>
        </div>
        <ul className="daily-goals">
          {dailyGoals.map((goal) => {
            const className = classNames({
              'not-started': goal.actual === 0,
              started: goal.actual > 0 && goal.actual < goal.day,
              complete: goal.actual === goal.day,
            });
            return (
              <li key={goal.tag} className={className}>
                <span>{goal.tag}</span>
                {' '}
                <span>{goal.actual}</span>
                {' / '}
                <span>{goal.day}</span>
              </li>
            );
          })}
        </ul>
        {['tags', 'people', 'locations'].map((section) => (
          <ul key={section}>
            {Object.keys(this.props.summary[section]).map((key) => {
              const duration = formatters.displayDuration(this.props.summary[section][key].day);
              return (
                <SummaryTag section={section} key={key} item={key} duration={duration} onClick={this.onClickKey} />
              );
            })}
          </ul>
        ))}
      </section>
    );
  }
}
