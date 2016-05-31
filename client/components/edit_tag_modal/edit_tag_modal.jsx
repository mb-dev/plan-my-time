import React from 'react';
import Modal from '../modal/modal';

import actions from '../../actions/actions';
import * as formatters from '../../../shared/client/formatters/formatters';

export default class EditTagModal extends React.Component {
  static propTypes = {
    tag: React.PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.onEditTagSave = this.onEditTagSave.bind(this);
    this.state = {
      showInCalendar: false,
      groupName: '',
    };
  }
  async onEditTagSave(e) {
    e.preventDefault();
    const showInCalendar = this.refs.showInCalendar.checked;
    const groupName = this.refs.groupName.value;
    await actions.saveTag(this.props.tag, {
      showInCalendar,
      groupName,
    });
    await actions.getAllTags();
    actions.closeDialog('editTag');
  }
  onEditGoalsClosed() {
    actions.closeDialog('editTag');
  }

  render() {
    const title = <span>Edit Goals</span>;
    return (
      <Modal handleSaveModal={this.onEditGoalsSave} handleHideModal={this.onEditGoalsClosed} title={title}>
        <form onSubmit={this.onEditGoalsSave}>
          <div className="form-group">
            <label>Tag Name:</label>
            <input type="text" className="form-control" defaultValue={this.props.tag} readOnly />
          </div>
          <div className="form-group">
            <label>Show In Calendar:</label>
            <input type="checkbox" className="form-control" defaultValue={this.state.showInCalendar} ref="showInCalendar" />
          </div>
          <div className="form-group">
            <label>Group:</label>
            <input type="text" className="form-control" defaultValue={this.state.groupName} ref="groupName" />
          </div>
        </form>
      </Modal>
    );
  }
}


