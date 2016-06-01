import _            from 'lodash';
import React from 'react';
import Modal from '../modal/modal';

import actions from '../../actions/actions';
import * as formatters from '../../../shared/client/formatters/formatters';

export default class EditTagModal extends React.Component {
  static propTypes = {
    tag: React.PropTypes.object,
    calendarTagsList: React.PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.onEditTagSave = this.onEditTagSave.bind(this);
  }
  async onEditTagSave(e) {
    e.preventDefault();
    const calendarTagsMap = _.keyBy(this.props.calendarTagsList);
    const showInCalendar = this.refs.showInCalendar.checked;
    if (showInCalendar) {
      calendarTagsMap[this.props.tag.tag] = true;
    } else {
      delete calendarTagsMap[this.props.tag.tag];
    }
    const groupName = this.refs.groupName.value;
    await actions.saveTag(formatters.toFullTag(this.props.tag), {
      groupName,
    });
    await actions.saveUserSettings({
      calendarTagsList: Object.keys(calendarTagsMap).sort(),
    });
    await actions.getAllTags();
    await actions.getUserInfo();
    actions.closeModal('edit-tag');
  }
  onEditTagClosed() {
    actions.closeModal('edit-tag');
  }

  render() {
    const calendarTagsMap = _.keyBy(this.props.calendarTagsList);
    const showInCalendar = !!calendarTagsMap[this.props.tag.tag];
    const title = <span>Edit Goals</span>;
    return (
      <Modal handleSaveModal={this.onEditTagSave} handleHideModal={this.onEditTagClosed} title={title}>
        <form onSubmit={this.onEditGoalsSave}>
          <div className="form-group">
            <label>Tag Name:</label>
            <input type="text" className="form-control" defaultValue={formatters.toFullTag(this.props.tag)} readOnly />
          </div>
          <div className="form-group">
            <label>Show In Calendar:</label>
            <input type="checkbox" className="form-control" defaultChecked={showInCalendar} ref="showInCalendar" />
          </div>
          <div className="form-group">
            <label>Group:</label>
            <input type="text" className="form-control" defaultValue={this.props.tag.groupName} ref="groupName" />
          </div>
        </form>
      </Modal>
    );
  }
}
