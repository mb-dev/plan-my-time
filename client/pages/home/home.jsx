import _          from 'lodash';
import React      from 'react';
import store      from '../../stores/store';
import actions    from '../../actions/actions';
import TextEditor from '../../components/texteditor/texteditor';
import * as formatters from '../../libraries/formatters/formatters';

require('./home.less');

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {};
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getJournal(this.state.date);
    actions.getMetadata(this.state.date);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onTextUpdated(text) {
    actions.updateJournal(this.state.date, text);
  }
  updateState(props) {
    this.setState({
      date: store.state.date,
      text: store.state.text,
      lastUpdated: store.state.lastUpdated ? store.state.lastUpdated.toString() : undefined,
      summary: store.state.metadata ? store.state.metadata.summary : undefined
    });
  }
  onChangeDate(date, e) {
    e.preventDefault();
    actions.switchDate(date);
  }
  render() {
    let getDateRange = function(date) {
      let startDiff = -3;
      let endDiff = 3;
      if (formatters.isToday(date)) {
        startDiff = -7;
        endDiff = 0;
      }
      return _.range(startDiff, endDiff+1).map(function(diff) {
        return [diff, formatters.getDateByDiff(date, diff)];
      });
    }
    let dateRange = getDateRange(this.state.date);

    return (
      <div className="home-page container">
        <nav className="day-nav">
          { dateRange.map((diffDate) => {
            let diff = diffDate[0];
            let date = diffDate[1];
            let activeClass = diff == 0 ? 'active' : '';
            let todayClass = formatters.isToday(date) ? 'today' : '';
            let className = 'day ' + activeClass + ' ' + todayClass;
            return (
              <a className={className} key={date} onClick={this.onChangeDate.bind(this, date)} href=''>
                <span className="date">{date.getDate()}</span>
                <span className="day">{formatters.getDayOfWeek(date)}</span>
              </a>
            )
          })}
        </nav>
        <section className="main-pane">
          <h2>Today:</h2>
          { this.state.text !== undefined &&
            <div>
              <div>Last updated {formatters.displayTimeAgo(this.state.lastUpdated)}</div>
              <TextEditor text={this.state.text} onUpdate={this.onTextUpdated.bind(this)} />
            </div>
          }
        </section>
        <section className="right-pane">
          <h2>Tags:</h2>
        </section>
        <section className="summary-pane">
          <h2>Summary</h2>
          { this.state.summary !== undefined &&
            <ul>
              { Object.keys(this.state.summary).map((key) => { return (
                <li key={key}>{key}: {formatters.displayDuration(this.state.summary[key])}</li>
              )}) }
            </ul>
          }
        </section>
      </div>
    );
  }
}
