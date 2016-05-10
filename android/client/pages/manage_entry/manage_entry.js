import React, {
  Component,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import Button from 'react-native-button';
import * as formatters from '../../../../shared/client/formatters/formatters';
import actions from '../../actions/actions';
import store from '../../stores/store';
import _ from 'lodash';
import styles from './manage_entry.style';

export default class Entry extends Component {
  static propTypes = {
    line: React.PropTypes.string,
    date: React.PropTypes.object,
    navigator: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      entry: {tags: []},
      textValue: '',
    };
    const currentDate = new Date();
    if (props.line) {
      this.state.line = props.line;
      this.state.editLine = true;
    } else {
      this.state.line = '- ' + formatters.getTimeFormat(currentDate) + ' ';
    }
    this.onAddTag = this.onAddTag.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLineChanged = this.onLineChanged.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onStoreChanged = this.onStoreChanged.bind(this);
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getTags({date: formatters.getDateByDiff(new Date(), -1)});
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onAddTag() {
    this.props.navigator.push({name: 'select-tag'});
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onLineChanged(text) {
    this.setState({
      line: text,
    });
  }
  onSubmit() {
    // TODO: figure out why there's a new line in the text??
    const newLine = this.state.line.replace(/\r/g, '');
    let promise = null;
    if (this.props.line) {
      promise = actions.editEntry(this.props.date, this.props.line, newLine);
    } else {
      promise = actions.addEntry(this.props.date, newLine);
    }
    promise.then(() => this.props.navigator.pop());
  }
  onAddTag(tag) {
    this.setState({
      line: (this.state.line + ' #' + tag.tag).replace(/\s\s+/g, ' '),
    });
  }
  updateState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.tag !== r2.tag});
    this.setState({
      tags: ds.cloneWithRows(_.sortBy(store.state.manage.tags, 'tag')),
    });
  }
  renderRow(tag) {
    return (
      <TouchableHighlight style={styles.row} onPress={this.onAddTag.bind(this, tag)}>
        <Text>{tag.tag}</Text>
      </TouchableHighlight>
    );
  }
  render() {
    let title = '';
    if (this.props.line) {
      title = 'Edit Line';
    } else {
      title = 'Add Line';
    }
    return (
      <View>
        <Text>{title}</Text>
        <TextInput defaultValue={this.state.line} onChangeText={this.onLineChanged} />
        <Button onPress={this.onAddTag}>Add Tag</Button>
        <Button onPress={this.onSubmit}>Submit</Button>
        <ListView dataSource={this.state.tags} renderRow={this.renderRow} />
      </View>
    );
  }
}
