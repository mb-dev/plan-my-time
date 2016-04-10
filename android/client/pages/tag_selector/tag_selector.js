import React, {
  Component,
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
} from 'react-native';
import actions from '../../actions/actions';

export default class TagSelector extends Component {
  onClickTag(tag) {
    actions.addTag(tag);
    this.props.navigator.pop();
  }
  renderRow(tag) {
    return (
      <TouchableHighlight onPress={this.onClickTag.bind(tag)}>
        <Text>{tag.name}</Text>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View>
        <Text>Select Tag:</Text>
        <TextInput />
        <ListView dataSource={this.state.tags} renderRow={this.renderRow} />
      </View>
    );
  }
}

