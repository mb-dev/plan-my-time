import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';
import d3              from 'd3';
import dimple          from 'dimple';
require('./report.less');

export default class Report extends React.Component {
  componentDidMount() {
    var data = [
      {date: '2/11', time: '8', name: 'wakeup'},
      {date: '2/11', time: '22', name: 'sleep'},
      {date: '2/12', time: '9', name: 'wakeup'},
      {date: '2/12', time: '23', name: 'sleep'}
    ];
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
  render() {

    return (
      <div id="chartContainer">
      </div>
    );
  }
}
