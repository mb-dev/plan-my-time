import _               from 'lodash';
import React           from 'react';
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
  }
  componentDidMount() {
    actions.getMetadata(this.state.date);
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
    let firstDate = formatters.getFirstVisualDay(this.state.date);
    let lastDate = formatters.getLastVisualDay(this.state.date);
    let currentDate = firstDate;
    let weeksInMonth = formatters.getWeeksInAMonth(this.state.date);
    let rows = _.times(weeksInMonth).map((week) => { return ( 
        <tr key={week}>
          {_.times(7).map((day) => { return (
            <td key={day}>
              {week} {day}
              Event 1
              Event 2
            </td>
          )})}
        </tr>
    )});
    return rows;
  }
  updateState(props) {
    this.setState({
      date: store.state.date,
      selectedTags: ['wakeup', 'sleep'],
      metadata: store.state.metadata ? store.state.metadata.metadata : undefined,
      summary: store.state.metadata ? store.state.metadata.summary : undefined
    });
  }
  render() {
    let calendar = this.renderCalendar();
    return (
      <div className="report-page">
        <table>
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
