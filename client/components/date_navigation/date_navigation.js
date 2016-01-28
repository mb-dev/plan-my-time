import React           from 'react';
import * as formatters from '../../libraries/formatters/formatters';

function getDateRange(date) {
  let diffFromToday = formatters.getDaysDifference(date, new Date());
  let endDiff = Math.min(3, diffFromToday);
  let startDiff = endDiff - 7;
  return _.range(startDiff, endDiff+1).map(function(diff) {
    return [diff, formatters.getDateByDiff(date, diff)];
  });
}

export default class DateNavigation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  componentWillReceiveProps(props) {
  }
  onChangeDate(date, e) {
    e.preventDefault();
    if (this.props.onUpdate) {
      this.props.onUpdate(date);
    }
  }
  render() {
    let dateRange = getDateRange(this.props.date);
    return (<nav className="day-nav">
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
    </nav>);
  }
}
