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
    actions.loadSettings();
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  async onSaveSettings() {
    if (store.state.settings.apiKey !== this.state.apiKey) {
      await actions.setApiKey(this.state.apiKey);
    }
    await actions.setDevelopMode(this.state.developMode);
    this.props.navigator.pop();
  }
  updateState(props) {
    this.setState({
      notFoundError: store.state.settings.notFound,
      apiKey: store.state.settings.apiKey,
      developMode: store.state.settings.developMode,
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
