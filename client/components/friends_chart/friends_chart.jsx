import React           from 'react';
import * as formatters from '../../../shared/client/formatters/formatters';
import dimple          from 'dimple';
import d3              from 'd3';

export default class HourOfDayChart extends React.Component {
  static propTypes = {
    metadata: React.PropTypes.array,
  }
  componentDidMount() {
    this.renderChart();
  }
  componentDidUpdate() {
    this.renderChart();
  }
  renderChart() {

  }
  render() {
    return (
      <div className="chart-container friends-chart" ref="chartContainer" />
    );
  }
}
