import _               from 'lodash';
import React           from 'react';
import {Link}          from 'react-router';
import store           from '../../stores/store';
import actions         from '../../actions/actions';
import * as formatters from '../../../shared/client/formatters/formatters';
import Calendar        from '../../components/calendar/calendar';
import HourOfDayChart  from '../../components/hour_of_day_chart/hour_of_day_chart';
import FriendsChart    from '../../components/friends_chart/friends_chart';
require('./report.less');

export default class Report extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    year: React.PropTypes.string,
    quarter: React.PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {};
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    actions.getReportMetadata(this.state.year, this.state.quarter);
    store.addChangeListener(this.onStoreChanged);
  }
  componentDidUpdate() {
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  updateState(props) {
    const year = parseInt(props.year, 10) || new Date().getFullYear();
    const quarter =  parseInt(props.quarter, 10) || formatters.currentQuarter();
    this.setState({
      year: year,
      quarter: quarter,
      months: formatters.getQuarterMonths(year, quarter),
      hourOfDayTagsList: ['wakeup', 'sleep'],
      calendarTagsList: store.state.userSettings.calendarTagsList,
      metadata: store.state.report.metadata ? store.state.report.metadata : [],
      summary: store.state.report.metadata && store.state.report.metadata.length > 0 ? store.state.report.metadata[0].summary : undefined,
    });
  }
  render() {
    if (!this.state.metadata || this.state.metadata.length === 0) {
      return <div className="report-page" />;
    }
    const prevQuarter = formatters.getPrevQuarter(this.state.year, this.state.quarter);
    const nextQuarter = formatters.getNextQuarter(this.state.year, this.state.quarter);
    return (
      <div className="report-page">
        <nav className="month-nav">
          <Link to={`/report/${prevQuarter.year}/${prevQuarter.quarter}`}>&lt; Next Quarter</Link>
          {' '}
          {formatters.printQuarter(this.state.year, this.state.quarter)}
          {' '}
          <Link to={`/report/${nextQuarter.year}/${nextQuarter.quarter}`}>Next Quarter &gt;</Link>
        </nav>
        <div className="calendars">
          {this.state.metadata.map((metadata, index) => (
            <Calendar
              key={`${this.state.months[index]}-${this.state.year}`}
              year={this.state.year}
              month={this.state.months[index]}
              includeTags={this.state.calendarTagsList}
              metadata={this.state.metadata[index].metadata}
            />
          ))}
        </div>
        <div className="charts">
          <HourOfDayChart
            includeTags={this.state.hourOfDayTagsList}
            metadata={this.state.metadata[0].metadata}
          />
          <FriendsChart
            metadata={this.state.metadata}
          />
        </div>
        {this.state.summary !== undefined &&
          <ul id="hashtags">
            {Object.keys(this.state.summary).map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        }
      </div>
    );
  }
}
