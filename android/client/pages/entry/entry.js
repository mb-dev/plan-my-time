import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';

export default class Entry extends Component {
  constructor() {
    this.state = {entry: {tags: []}};
  }
  onAddTag() {
    this.props.navigator.push({name: 'select-tag'});
  }
  render() {
    return (
      <View>
        <Text>
          Tags:
        </Text>
        <TextInput></TextInput>
        <Button>Add Tag</Button>
      </View>
    );
  }
}


