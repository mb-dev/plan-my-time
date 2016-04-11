import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';

export default class TagsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {tags: {tags: [], locations: [], people: []}};
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
    return (
      <div className="tags-page">
        {['tags', 'people', 'locations'].map((type) => (
          <ul key={type}>
            <li><b>{type}</b></li>
            { this.state.tags[type].map((tag) => (
              <li key={tag.tag}>{tag.tag}</li>
            ))}
          </ul>
        ))}
      </div>
    );
  }
}
