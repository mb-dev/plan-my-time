import React, {
  Component,
  Text,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import store from '../../stores/store';
import actions from '../../actions/actions';
import * as formatters from '../../../../shared/client/formatters/formatters';
import styles from './home.style';

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
  renderRow(entry, sectionID, rowID) {
    const evenRow = rowID % 2 === 0;
    return (
      <TouchableHighlight style={[styles.entryRow, evenRow && styles.entryRowEven]} onPress={this.onEditTask.bind(this, entry)}>
        <Text>{entry.line}</Text>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.pageTitle}>
            Plan My Time
          </Text>
          <View style={styles.buttonRow}>
            <Button onPress={this.onAddTask}>
              <Icon name="md-add-circle" size={30} color="#000000" />
            </Button>
            <Button onPress={this.onSettings}>
              <Icon style={styles.rowButton} name="md-settings" size={30} color="#000000" />
            </Button>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Button style={styles.toolbarButton} onPress={this.onPrevDay}>Prev Day</Button>
          <Button style={styles.refreshBtn}onPress={this.onRefresh}>Refresh</Button>
          <Button style={styles.toolbarButton} onPress={this.onNextDay}>Next Day</Button>
        </View>
        <Text style={styles.dateString}>{formatters.getYearMonthDate(this.state.date)}</Text>
        <ListView dataSource={this.state.entries}
                  renderRow={this.renderRow}
        />
      </View>
    );
  }
}

