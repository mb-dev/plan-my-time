import _            from 'lodash';
import React        from 'react';
import {Link}       from 'react-router';
import actions      from '../../actions/actions';
import EditTagModal from '../../components/edit_tag_modal/edit_tag_modal';
import store        from '../../stores/store';
import * as formatters from '../../../shared/client/formatters/formatters';

require('./tags.less');

export default class TagsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sortBy: 'name',
      tags: {
        tags: [],
        locations: [],
        people: [],
      },
    };
    this.onStoreChanged = this.onStoreChanged.bind(this);
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getAllTags();
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onEditTag(tag, e) {
    e.preventDefault();
    actions.openModal('edit-tag', {tag: tag});
  }
  onChangeSort(sortBy, dir, e) {
    e.preventDefault();
    this.setState({sortBy: sortBy, sortDir: dir});
  }
  updateState() {
    const tagByType = _.groupBy(store.state.tags, 'type');
    this.setState({
      calendarTagsList: store.state.userSettings.calendarTagsList,
      tags: {
        tags: tagByType.tag || [],
        people: tagByType.person || [],
        locations: tagByType.location || [],
      },
      showEditTagModal: store.state.modal.displayedModal === 'edit-tag',
      tagModalParams: store.state.modal.params,
    });
  }
  render() {
    const tagTypes = ['tags', 'people', 'locations'];
    const calendarTagsMap = _.keyBy(this.state.calendarTagsList);
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
            {sortedTags[type].map((tag) => (
              <li key={tag.tag}>
                <a href="" onClick={this.onEditTag.bind(this, tag)}>
                  <i className="fa fa-edit fa-fw" />
                </a>
                {type === 'tags' && calendarTagsMap[tag.tag] &&
                  <i className="fa fa-calendar fa-fw" />
                }
                <span><Link to={`/tags/${encodeURIComponent(formatters.toFullTag(tag.type, tag.tag))}`}>{tag.tag}</Link></span>{' '}
                <span className="count">{tag.count}</span>
                {' '}
                <span className="last_date">{tag.last_date}</span>
                {' '}
                <span className="group-name">{tag.groupName}</span>
              </li>
            ))}
          </ul>
        ))}
        {this.state.showEditTagModal &&
          <EditTagModal tag={this.state.tagModalParams.tag} calendarTagsList={this.state.calendarTagsList} />
        }
      </div>
    );
  }
}
