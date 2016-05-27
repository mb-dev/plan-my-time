import React from 'react';
import Modal from '../modal/modal';

import actions from '../../actions/actions';
import * as formatters from '../../../shared/client/formatters/formatters';

export default class EditGoalsModal extends React.Component {
  static propTypes = {
    date: React.PropTypes.date,
  }
  constructor(props) {
    super(props);
    this.onEditGoalsSave = this.onEditGoalsSave.bind(this);
    this.state = {
      startDate: formatters.getStartQuarterFromDate(this.props.date),
      endDate: formatters.getEndOfQuarterFromDate(this.props.date),
    };
  }
  async onEditGoalsSave(e) {
    e.preventDefault();
    const content = this.refs.content.value;
    await actions.saveGoalsFile(this.state.startDate, this.state.endDate, content);
    await actions.getGoals(this.props.date);
    actions.closeEditGoalsDialog();
  }
  onEditGoalsClosed() {
    actions.closeEditGoalsDialog();
  }

  render() {
    const title = <span>Edit Goals</span>;
    return (
      <Modal handleSaveModal={this.onEditGoalsSave} handleHideModal={this.onEditGoalsClosed} title={title}>
        <form onSubmit={this.onEditGoalsSave}>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="text" className="form-control" defaultValue={formatters.getYearMonthDate(this.state.startDate)} readOnly />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="text" className="form-control" defaultValue={formatters.getYearMonthDate(this.state.endDate)} readOnly />
          </div>
          <div className="form-group">
            <label>Goals:</label>
            <textarea className="form-control" defaultValue={this.state.goalsContent} ref="content" />
          </div>
        </form>
      </Modal>
    );
  }
}

