import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';
import * as formatters from '../../../../shared/client/formatters/formatters';
import actions from '../../actions/actions';

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
  }
  componentDidMount() {

  }
  onAddTag() {
    this.props.navigator.push({name: 'select-tag'});
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
      </View>
    );
  }
}
