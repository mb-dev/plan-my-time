import _               from 'lodash';
import React           from 'react';
import Mousetrap       from 'mousetrap';
import MousetrapGlobal from 'mousetrap/plugins/global-bind/mousetrap-global-bind';
import actions         from '../../actions/actions';
import store           from '../../stores/store';
require('./texteditor.less');

export default class TextEditor extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {text: props.text, lineCount: this.lineCount(props.text)};
    this.onChange = this.onChange.bind(this);
    this.debounceOnUpdate = _.debounce(() => {
      actions.updateJournal(store.state.date, store.state.text);
    }, 5000);
  }
  componentWillMount() {

  }
  componentDidMount() {
    this.refs.mainTextArea.focus();
    Mousetrap.bindGlobal(['ctrl+s', 'command+s'], () => {
      actions.updateJournal(store.state.date, store.state.text);
      this.debounceOnUpdate.cancel();
      return false;
    });
  }
  componentWillReceiveProps(props) {
    this.state.lastTextName = props.textName;
    this.refs.mainTextArea.value = props.text;
    this.setState({lineCount: this.lineCount(props.text)});
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    Mousetrap.unbind(['ctrl+s'], ['command+s']);
  }
  onChange() {
    const text = this.refs.mainTextArea.value;
    this.debounceOnUpdate();
    this.setState({lineCount: this.lineCount(text)});
    actions.textUpdated(text);
  }
  lineCount(text) {
    const minLines = 10;
    const matches = text.match(/\n/g);
    if (!matches) {
      return minLines;
    }
    return Math.max(minLines, matches.length + 2);
  }
  addTag(tag, section) {
    let prefix = '#';
    if (section === 'locations') {
      prefix = '$';
    } else if (section === 'people') {
      prefix = '@';
    }
    this.refs.mainTextArea.value += prefix + tag;
  }
  render() {
    return (
      <div className="text-editor">
        <textarea ref="mainTextArea" defaultValue={this.props.text} onChange={this.onChange} rows={this.state.lineCount}></textarea>
      </div>
    );
  }
}
