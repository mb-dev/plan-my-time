import React           from 'react';
import * as formatters from '../../../shared/client/formatters/formatters';
import dimple          from 'dimple';
import d3              from 'd3';

export default class HourOfDayChart extends React.Component {
  static propTypes = {
    metadata: React.PropTypes.array,
    includeTags: React.PropTypes.array,
  }
  componentDidMount() {
    this.renderChart();
  }
  componentDidUpdate() {
    this.renderChart();
  }
  renderChart() {
    if (!this.props.metadata) {
      return;
    }
    const data = [];
    this.props.includeTags.forEach((tag) => {
      this.props.metadata.forEach((dayMetadata) => {
        dayMetadata.tasks.forEach((task) => {
          const startDate = formatters.parseDate(task.start_time);
          if (task.tags.indexOf(tag) >= 0) {
            data.push({
              date: formatters.displayDateMonth(startDate),
              time: formatters.displayTimeAsNumber(startDate),
              name: tag,
            });
          }
        });
      });
    });
    this.refs.chartContainer.innerHTML = '';
    const svg = dimple.newSvg('.hour-of-day-chart', 590, 400);
    const myChart = new dimple.chart(svg, data);
    myChart.setBounds(60, 30, 500, 330);
    const axis = myChart.addTimeAxis('x', 'date', '%m/%d', '%m/%d');
    axis.timePeriod = d3.time.days;
    myChart.addMeasureAxis('y', 'time');
    myChart.addSeries('name', dimple.plot.bubble);
    myChart.addLegend(200, 10, 360, 20, 'right');
    myChart.draw();
  }
  render() {
    return (
      <div className="chart-container hour-of-day-chart" ref="chartContainer" />
    );
  }
}
