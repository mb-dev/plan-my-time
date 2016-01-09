import React      from 'react';
import store      from '../../stores/store'
import actions    from '../../actions/actions'
import TextEditor from '../../components/texteditor/texteditor'
import formatters from '../../libraries/formatters/formatters'

require('./home.less');

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.state = {};
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
    actions.getTodayTasks();
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  onTextUpdated(text) {
    actions.updateTodayTasks(text);
  }
  updateState(props) {
    this.setState({
      text: store.state.text,
      lastUpdated: store.state.lastUpdated.toString()
    });
  }
  render() {
    return (
      <div className="home-page container">
        { this.state.text !== undefined &&
          <div>
            <div>Last updated {formatters.displayTimeAgo(this.state.lastUpdated)}</div>
            <TextEditor text={this.state.text} onUpdate={this.onTextUpdated} />
          </div>
        }
      </div>
    );
  }
}
