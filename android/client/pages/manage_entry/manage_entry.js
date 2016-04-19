import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';
import * as formatters from '../../../../shared/client/formatters/formatters';

export default class Entry extends Component {
  constructor() {
    this.state = {
      entry: {tags: []},
      textValue: '',
    };
    const currentDate = new Date();
    this.state.textValue = formatters.getTimeEntry(currentDate) + ' ';
  }
  componentDidMount() {

  }
  onAddTag() {
    this.props.navigator.push({name: 'select-tag'});
  }
  render() {
    return (
      <View>
        <TextInput defaultValue={this.state.initialText} />
        <Button onClick={this.onAddTag}>Add Tag</Button>
      </View>
    );
  }
}
