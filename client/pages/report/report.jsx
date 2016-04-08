import _               from 'lodash';
import React           from 'react';
import {Link}          from 'react-router';
import store           from '../../stores/store';
import actions         from '../../actions/actions';
import d3              from 'd3';
import dimple          from 'dimple';
import * as formatters from '../../libraries/formatters/formatters';

require('./report.less');

export default class Report extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.onPrevMonth = this.onPrevMonth.bind(this);
    this.onNextMonth = this.onNextMonth.bind(this);
  }
  componentDidMount() {
    actions.getMetadata(this.state.date, 'report');
    store.addChangeListener(this.onStoreChanged);
    this.renderChart();
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  componentDidUpdate() {
    this.renderChart();
  }
  onPrevMonth(e) {
    e.preventDefault();
    actions.getMetadata(
      formatters.getPrevMonth(this.state.date),
      'report'
    );
  }
  onNextMonth(e) {
    e.preventDefault();
    actions.getMetadata(
      formatters.getNextMonth(this.state.date),
      'report'
    );
  }
  renderChart() {
    if (this.state.metadata === undefined) {
      return;
    }

    let data = [];
    this.state.selectedTags.forEach((tag) =>  {
      this.state.metadata.forEach((dayMetadata) => {
        dayMetadata.tasks.forEach((task) => {
          let startDate = formatters.parseDate(task.start_time);
          if (task.tags.indexOf(tag) >= 0) {
            data.push({
              date: formatters.displayDateMonth(startDate),
              time: formatters.displayTimeAsNumber(startDate),
              name: tag
            });
          }
        });
      });
    });
    this.refs.chartContainer.innerHTML = "";
    var svg = dimple.newSvg("#chartContainer", 590, 400);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(60, 30, 500, 330)
    var axis = myChart.addTimeAxis("x", "date", '%m/%d', '%m/%d');
    axis.timePeriod = d3.time.days;
    myChart.addMeasureAxis("y", "time");
    myChart.addSeries("name", dimple.plot.bubble);
    myChart.addLegend(200, 10, 360, 20, "right");
    myChart.draw();
  }
  renderCalendar() {
    if (this.state.metadata === undefined) {
      return '';
    }
    let firstDate = formatters.getFirstVisualDay(this.state.date);
    let lastDate = formatters.getLastVisualDay(this.state.date);
    let currentDate = firstDate;
    let weeksInMonth = formatters.getWeeksBetweenDates(firstDate, lastDate);
    let events = {};
    let includeTags = ['project-math-comp-sci', 'social', 'social-activity', 'date'];
    this.state.metadata.forEach((dayMetadata) => {
      dayMetadata.tasks.forEach((task) => {
        let startDate = formatters.parseDate(task.start_time);
        let taskDate = startDate.getDate();
        if (task.tags.length > 0 && _.intersection(task.tags, includeTags).length > 0) {
          events[taskDate] = events[taskDate] || [];
          events[taskDate].push({
            time: formatters.getTimeFormat(startDate),
            name: task.tags[0]
          });
        }
      });
    });
    let rows = _.times(weeksInMonth).map((week) => { return ( 
        <tr key={week}>
          {_.times(7).map((day) => { 
            let cd = new Date(currentDate.getTime());
            let cdate = cd.getDate();
            currentDate.setDate(currentDate.getDate() + 1);
            return (
            <td key={day}>
              <Link to={{pathname: '/', query: {date: formatters.getYearMonthDate(cd)}}} className="date">{cdate}</Link>
              { this.state.date.getMonth() == cd.getMonth() && events[cdate] &&
                <ul>
                { events[cdate].map((event, index) => { return (
                  <li key={index}>
                    <span className="time">{event.time}</span>
                    <span className="name">{event.name}</span>
                  </li>
                )})}
                </ul>
              }
            </td>
          )})}
        </tr>
    )});
    return rows;
  }
  updateState(props) {
    this.setState({
      date: store.state.report.date,
      selectedTags: ['wakeup', 'sleep'],
      metadata: store.state.report.metadata ? store.state.report.metadata.metadata : undefined,
      summary: store.state.report.metadata ? store.state.report.metadata.summary : undefined
    });
  }
  render() {
    let calendar = this.renderCalendar();
    return (
      <div className="report-page">
        <nav className="month-nav">
          <a href="" className="btn prev-month" onClick={this.onPrevMonth}>&lt; Previous Month</a>
          { formatters.getYearMonth(this.state.date) }
          <a href="" className="btn next-month" onClick={this.onNextMonth}>Next Month &gt;</a>
        </nav>
        <table className="calendar">
          <tbody>
            {calendar}
          </tbody>
        </table>
        <div id="chartContainer" ref="chartContainer">
        </div>
        { this.state.summary !== undefined &&
          <ul id="hashtags">
            { Object.keys(this.state.summary).map((tag) => { return (
              <li key={tag}>{tag}</li>
            )})}
          </ul>
        }
      </div>
    );
  }
}
