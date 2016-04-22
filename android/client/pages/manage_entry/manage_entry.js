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
    super();
    this.state = {
      entry: {tags: []},
      textValue: '',
    };
    const currentDate = new Date();
    this.state.textValue = formatters.getTimeFormat(currentDate) + ' ';
    this.onAddTag = this.onAddTag.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {

  }
  onAddTag() {
    this.props.navigator.push({name: 'select-tag'});
  }
  onSubmit() {

  }
  render() {
    return (
      <View>
        <TextInput defaultValue={this.state.textValue} />
        <Button onPress={this.onAddTag}>Add Tag</Button>
        <Button onPress={this.onSubmit}>Submit</Button>
      </View>
    );
  }
}
