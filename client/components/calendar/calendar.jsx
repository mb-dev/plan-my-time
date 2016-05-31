import _               from 'lodash';
import React           from 'react';
import * as formatters from '../../../shared/client/formatters/formatters';
import {Link}          from 'react-router';

require('./calendar.less');

export default class Calendar extends React.Component {
  static propTypes = {
    year: React.PropTypes.number,
    month: React.PropTypes.number,
    includeTags: React.PropTypes.array,
    metadata: React.PropTypes.array,
  }
  render() {
    if (!this.props.metadata) {
      return [];
    }
    const month = parseInt(this.props.month, 10);
    const year = parseInt(this.props.year, 10);
    const firstDate = formatters.getFirstVisualDay(year, month);
    const lastDate = formatters.getLastVisualDay(year, month);
    const weeksInMonth = formatters.getWeeksBetweenDates(firstDate, lastDate);
    const currentDate = firstDate;
    const events = {};
    this.props.metadata.forEach((dayMetadata) => {
      dayMetadata.tasks.forEach((task) => {
        const startDate = formatters.parseDate(task.start_time);
        const taskDate = startDate.getDate();
        if (task.tags.length > 0 && _.intersection(task.tags, this.props.includeTags).length > 0) {
          events[taskDate] = events[taskDate] || [];
          events[taskDate].push({
            time: formatters.getTimeFormat(startDate),
            name: task.tags[0],
          });
        }
      });
    });
    const rows = _.times(weeksInMonth).map(week => (
      <tr key={week}>
        {_.times(7).map((day) => {
          const cd = new Date(currentDate.getTime());
          const cdate = cd.getDate();
          currentDate.setDate(currentDate.getDate() + 1);
          return (
            <td key={day}>
              <Link to={{pathname: '/', query: {date: formatters.getYearMonthDate(cd)}}} className="date">{cdate}</Link>
              {month === cd.getMonth() && events[cdate] &&
                <ul>
                {events[cdate].map((event, index) => (
                  <li key={index}>
                    <span className="time">{event.time}</span>
                    <span className="name">{event.name}</span>
                  </li>
                ))}
                </ul>
              }
            </td>
            );
        })}
      </tr>
    ));
    return (
      <table className="calendar">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}
