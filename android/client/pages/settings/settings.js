import React, {
  Component,
  Text,
  Switch,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';
import store from '../../stores/store';
import actions from '../../actions/actions';
import storage from '../../libraries/storage/storage';

export default class Settings extends Component {
  constructor() {
    super();
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.onSaveSettings = this.onSaveSettings.bind(this);
    this.state = {apiKey: '', developMode: false};
  }
  componentWillMount() {
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    (async () => {
      const settings = await storage.getSettings();
      this.setState({
        originalApiKey: settings.apiKey || '',
        apiKey: settings.apiKey || '',
        developMode: settings.developMode || false,
      });
    })();
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  async onSaveSettings() {
    if (this.state.originalApiKey !== this.state.apiKey) {
      await actions.setApiKey(this.state.apiKey);
    }
    await storage.setSettings({apiKey: this.state.apiKey, developMode: this.state.developMode});
    this.props.navigator.pop();
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
        <TextInput defaultValue={this.state.apiKey} onChangeText={(text) => this.setState({apiKey: text})} />
        <View>
          <Switch
            onValueChange={(value) => this.setState({developMode: value})}
            style={{marginBottom: 10}}
            value={this.state.developMode}
          />
          <Text>Develop Mode</Text>
        </View>
        <Button onPress={this.onSaveSettings}>Save</Button>
      </View>
    );
  }
}
