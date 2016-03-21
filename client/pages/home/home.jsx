import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';
import DateNavigation  from '../../components/date_navigation/date_navigation';
import ProgressBar     from '../../components/progress_bar/progress_bar';
import TextEditor      from '../../components/texteditor/texteditor';
import SummaryPane     from '../../components/summary_pane/summary_pane';
import * as formatters from '../../libraries/formatters/formatters';
import HourMarker      from '../../app/time_tracker/hour_marker';
import MetadataTracker from '../../app/metadata_tracker/metadata_tracker';
import PollChanges     from '../../app/poll_changes/poll_changes';
require('./home.less');

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
    this.hourMarker = new HourMarker();
    this.metadataTracker = new MetadataTracker();
    this.pollChanges = new PollChanges();
    this.state = {};
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getJournal(this.state.date);
    actions.getMetadata(this.state.date);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
    this.metadataTracker.unsubscribe();
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onTextUpdated(text) {
    actions.updateJournal(this.state.date, text);
  }
  updateState(props) {
    this.setState({
      date: store.state.date,
      text: store.state.text,
      serverError: store.state.serverError,
      currentTask: store.state.currentTask,
      percent: store.state.currentPercent || 0,
      nextTask: store.state.nextTask,
      lastUpdated: store.state.lastUpdated ? store.state.lastUpdated.toString() : undefined,
      summary: store.state.metadata ? store.state.metadata.summary : undefined
    });
  }
  onChangeDate(date) {
    actions.switchDate(date);
  }
  onClickTag(key) {
    this.refs.textEditor.addTag(key);
  }
  render() {
    let percentLeft = this.state.percent * 100;
    return (
      <div className="home-page container">
        <DateNavigation date={this.state.date} onUpdate={this.onChangeDate.bind(this)}></DateNavigation>
        <ProgressBar completed={percentLeft}></ProgressBar>
        { this.state.serverError && 
          <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span className="sr-only">Error:</span>
            {this.state.serverError}
          </div>
        }
        <div>Current Task: {this.state.currentTask && this.state.currentTask.line}</div>
        <div>Next Task: {this.state.nextTask && this.state.nextTask.line}</div>
        <section className="main-pane">
        { this.state.text !== undefined &&
          <TextEditor ref="textEditor" text={this.state.text} onUpdate={this.onTextUpdated.bind(this)} textName={this.state.date.toString()}/>
          }
          <div className="break-notifications">
            <input type="checkbox" defaultChecked="true"/> Enable Break Notifications
          </div>
        </section>
        <section className="right-pane">
          <SummaryPane summary={this.state.summary} onClickTag={this.onClickTag}></SummaryPane>
        </section>
      </div>
    );
  }
}
