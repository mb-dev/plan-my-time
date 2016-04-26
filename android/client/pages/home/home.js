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
    this.onAddTask = this.onAddTask.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onSettings = this.onSettings.bind(this);
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
        actions.getEntries(this.state.date);
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
  onAddTask() {
    this.props.navigator.push({name: 'manage-task', index: 1, date: this.state.date});
  }
  onEditTask(entry) {
    this.props.navigator.push({name: 'manage-task', index: 1, date: this.state.date, line: entry.line});
  }
  onSettings() {
    this.props.navigator.push({name: 'settings', index: 1});
  }
  updateState(props) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.line !== r2.line});
    this.setState({
      entries: ds.cloneWithRows(store.state.entries),
      date: store.state.date,
    });
  }
  renderRow(entry) {
    return (
      <TouchableHighlight onPress={this.onEditTask.bind(this, entry)}>
        <Text>{entry.line}</Text>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.onAddTask}>Add Task</Button>
        <Button onPress={this.onSettings}>Settings</Button>
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

