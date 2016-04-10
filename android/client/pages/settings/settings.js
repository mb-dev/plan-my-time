import React, {
  Component,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';
import store from '../../stores/store';
import actions from '../../actions/actions';

export default class Settings extends Component {
  constructor() {
    super();
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.onSaveSettings = this.onSaveSettings.bind(this);
    this.state = { key: '' };
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onSaveSettings() {
    actions.setApiKey(this.state.key).then(() => {
      this.props.navigator.pop();
    }).catch(() => {
      // do nothing
    });
  }
  updateState(props) {
    this.setState({
      notFoundError: store.state.settings.notFound,
    });
  }
  render() {
    return (
      <View>
        { this.state.notFoundError &&
          <Text>API Key not found</Text>
        }
        <Text>API Key:</Text>
        <TextInput onChangeText={(text) => this.setState({ key: text })} />
        <Button onPress={this.onSaveSettings}>Save</Button>
      </View>
    );
  }
}
