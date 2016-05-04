import React, {
  Component,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  View,
  ListView,
} from 'react-native';
import Button from 'react-native-button';
import store from '../../stores/store';
import actions from '../../actions/actions';
import * as formatters from '../../../../shared/client/formatters/formatters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  refreshBtn: {
  },
  toolbarButton: {
    width: 100,
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
  static propTypes = {
    navigator: React.PropTypes.object,
  };
  constructor() {
    super();
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onSettings = this.onSettings.bind(this);
    this.onPrevDay = this.onPrevDay.bind(this);
    this.onNextDay = this.onNextDay.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {date: new Date()};
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
  onPrevDay() {
    const prevDate = formatters.getDateByDiff(this.state.date, -1);
    this.setState({date: prevDate});
    actions.getEntries(prevDate);
  }
  onNextDay() {
    const nextDate = formatters.getDateByDiff(this.state.date, 1);
    this.setState({date: nextDate});
    actions.getEntries(nextDate);
  }
  onRefresh() {
    actions.getEntries(this.state.date);
  }
  updateState(props) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.line !== r2.line});
    this.setState({
      entries: ds.cloneWithRows(store.state.entries),
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
        <Text style={styles.welcome}>
          Plan My Time
        </Text>
        <Button onPress={this.onAddTask}>Add Task</Button>
        <Button onPress={this.onSettings}>Settings</Button>
        <View style={styles.innerContainer}>
          <Button style={styles.toolbarButton} onPress={this.onPrevDay}>Prev Day</Button>
          <Button style={styles.refreshBtn}onPress={this.onRefresh}>Refresh</Button>
          <Button style={styles.toolbarButton} onPress={this.onNextDay}>Next Day</Button>
        </View>
        <Text>{formatters.getYearMonthDate(this.state.date)}</Text>
        <ListView dataSource={this.state.entries}
                  renderRow={this.renderRow}
        />
      </View>
    );
  }
}

