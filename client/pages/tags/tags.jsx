import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';

export default class TagsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {};
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
  }
  render() {
    return (
      {['tags', 'people', 'locations'].map((type) => { return (
        <ul key={type}>
          { this.state.tags[type].map((tag) => { return (
            <li key={tag.tag}>{tag.tag}</li>
          )})}
        </ul>
      )})}
    );
  }
}
