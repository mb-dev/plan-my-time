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
  constructor() {
    super();
    this.state = {
      entry: {tags: []},
      textValue: '',
    };
    const currentDate = new Date();
    this.state.line = formatters.getTimeFormat(currentDate) + ' ';
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
      line: '- ' + text,
    });
  }
  onSubmit() {
    actions.addEntry(this.props.date, this.state.line);
  }
  render() {
    return (
      <View>
        <TextInput defaultValue={this.state.line} onChangeText={this.onLineChanged}/>
        <Button onPress={this.onAddTag}>Add Tag</Button>
        <Button onPress={this.onSubmit}>Submit</Button>
      </View>
    );
  }
}
