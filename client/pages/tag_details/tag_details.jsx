import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';
import {Link} from 'react-router';

require('./tag_details.less');

export default class TagDetailsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {entries: []};
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getEntriesByTag(this.props.params.tagId);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  updateState(props) {
    this.setState({
      entries: store.state.tag_details.entries,
    });
  }
  render() {
    return (
      <div className="tag-details-page">
        {this.state.entries.map((entry) => (
          <ul className="tag-list" key={entry.date}>
            <li><Link to={`/?date=${entry.date}`}><b>{entry.date}</b></Link></li>
            { entry.tasks.map((task) => (
              <li key={task.line}>
                {task.line}
              </li>
            ))}
          </ul>
        ))}
      </div>
    );
  }
}
