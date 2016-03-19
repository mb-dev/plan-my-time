import _ from 'lodash';
import React from 'react';

require('./texteditor.less');

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {text: props.text};
    this.debounceOnUpdate = _.debounce(() => {
      this.state.text = this.mainTextArea.value;
      this.props.onUpdate(this.mainTextArea.value);
    }, 5000, {maxWait: 10000});
  }
  componentDidMount() {
    this.mainTextArea.focus();
    this.setState({lineCount: this.lineCount()});
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  componentWillReceiveProps(props) {
    if (this.state.lastTextName != props.textName) {
      this.state.lastTextName = props.textName;
      this.mainTextArea.value = props.text;
      this.setState({lineCount: this.lineCount()});
    }
  }
  lineCount() {
    let matches = this.mainTextArea.value.match(/\n/g);
    if (!matches) {
      return 1;
    }
    return matches.length + 1;
  }
  onChange(e) {
    this.setState({lineCount: this.lineCount()});
    this.debounceOnUpdate();
  }

  render() {
    return (
      <div className="text-editor">
        <textarea ref={(c) => this.mainTextArea = c} defaultValue={this.state.text} onChange={this.onChange.bind(this)} rows={this.state.lineCount}></textarea>
      </div>
    );
  }
}
