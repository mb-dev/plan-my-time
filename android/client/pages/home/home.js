import React, {
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import Button from 'react-native-button';
import store from '../../stores/store';
import actions from '../../actions/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default class Home extends Component {
  constructor() {
    super();
    this.onStoreChanged = this.onStoreChanged.bind(this);
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getUserInfo().then(() => {
      if (store.state.currentUser === null) {
        this.props.navigator.push({name: 'settings', index: 1});
      } else {
        actions.getEntries();
      }
    });
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onDidFocus() {
    console.log("entered home");
  }
  updateState(props) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.line !== r2.line});
    this.setState({
      entries: ds.cloneWithRows(store.state.entries),
    });
  }
  renderRow(entry) {
    return (
      <TouchableHighlight>
        <Text>{entry.line}</Text>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Button>Add Task</Button>
        <Text style={styles.welcome}>
          Plan My Time
        </Text>
        <ListView dataSource={this.state.entries}
                  renderRow={this.renderRow}
        />
      </View>
    );
  }
}

