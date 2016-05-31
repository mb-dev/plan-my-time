import React           from 'react';
import actions from '../../actions/actions';
import store           from '../../stores/store';

export default class SettingsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      calendarTagsList: [],
      request: null,
    };
    this.onStoreChanged = this.onStoreChanged.bind(this);
    this.onSubmitChanges = this.onSubmitChanges.bind(this);
  }
  async componentWillMount() {
    this.updateState();
  }
  componentDidMount() {
    store.addChangeListener(this.onStoreChanged);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChanged);
  }
  async onSubmitChanges(e) {
    e.preventDefault();
    const newSettings = {
      calendarTagsList: this.refs.calendarTagsList.value.split(',').sort(),
    };
    await actions.saveUserSettings(newSettings);
  }
  onStoreChanged() {
    this.updateState(this.props);
  }
  updateState() {
    this.setState({
      calendarTagsList: store.state.userSettings.calendarTagsList.join(','),
      request: store.state.request.state,
    });
  }
  render() {
    return (
      <div className="settings-page container">
        {this.state.request === 'pending' &&
          <div className="alert alert-warning">
            Saving...
          </div>
        }
        {this.state.request === 'ok' &&
          <div className="alert alert-success">
            Saved
          </div>
        }
        <form>
          <div className="form-group">
            <label>Tags to show in Calendar:</label>
            <textarea className="form-control" ref="calendarTagsList" defaultValue={this.state.calendarTagsList} />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={this.onSubmitChanges}>Submit Changes</button>
          </div>
        </form>
      </div>
    );
  }
}
