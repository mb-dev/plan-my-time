import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';

require('./tags.less');

export default class TagsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {sortBy: 'name', tags: {tags: [], locations: [], people: []}};
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getAllTags();
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onChangeSort(sortBy, dir, e) {
    e.preventDefault();
    this.setState({sortBy: sortBy, sortDir: dir});
  }
  updateState(props) {
    const tagByType = _.groupBy(store.state.tags, 'type');
    this.setState({
      tags: {
        tags: tagByType.tag || [],
        people: tagByType.person || [],
        locations: tagByType.location || [],
      },
    });
  }
  render() {
    const tagTypes = ['tags', 'people', 'locations'];
    const sortedTags = {};
    tagTypes.forEach((tagType) => {
      sortedTags[tagType] = _.sortBy(this.state.tags[tagType], this.state.sortBy);
      if (this.state.sortDir === 'desc') {
         sortedTags[tagType] = sortedTags[tagType].reverse();
      }
    });
    return (
      <div className="tags-page">
        <div className="sort-bar">
          <ul>
            <li><a href="" onClick={this.onChangeSort.bind(this, 'name', 'asc')}>Sort By Name</a></li>
            <li><a href="" onClick={this.onChangeSort.bind(this, 'count', 'asc')}>Sort By Count</a></li>
            <li><a href="" onClick={this.onChangeSort.bind(this, 'last_date', 'desc')}>Sort By Last Date</a></li>
          </ul>
        </div>
        {tagTypes.map((type) => (
          <ul className="tag-list" key={type}>
            <li><b>{type}</b></li>
            { sortedTags[type].map((tag) => (
              <li key={tag.tag}>
                <span>{tag.tag}</span>{' '}
                <span className="count">{tag.count}</span>{' '}
                <span className="last_date">{tag.last_date}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    );
  }
}
