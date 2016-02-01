import _               from 'lodash';
import React           from 'react';
import store           from '../../stores/store';
import actions         from '../../actions/actions';
import DateNavigation  from '../../components/date_navigation/date_navigation'
import TextEditor      from '../../components/texteditor/texteditor';
import SummaryPane     from '../../components/summary_pane/summary_pane'
import * as formatters from '../../libraries/formatters/formatters';
import HourMarker      from '../../app/time_tracker/hour_marker'

require('./home.less');

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.hourMarker = new HourMarker();
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
      lastUpdated: store.state.lastUpdated ? store.state.lastUpdated.toString() : undefined,
      summary: store.state.metadata ? store.state.metadata.summary : undefined
    });
  }
  onChangeDate(date) {
    actions.switchDate(date);
  }
  render() {
    return (
      <div className="home-page container">
        <DateNavigation date={this.state.date} onUpdate={this.onChangeDate.bind(this)}></DateNavigation>
        <section className="main-pane">
        { this.state.text !== undefined &&
          <TextEditor text={this.state.text} onUpdate={this.onTextUpdated.bind(this)} textName={this.state.date.toString()}/>
          }
          <div className="break-notifications">
            <input type="checkbox" defaultChecked="true"/> Enable Break Notifications
          </div>
        </section>
        <section className="right-pane">
          <h2>Tags:</h2>
        </section>
        <SummaryPane summary={this.state.summary}></SummaryPane>
      </div>
    );
  }
}
