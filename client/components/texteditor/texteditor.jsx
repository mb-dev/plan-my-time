import React from 'react';

require('./texteditor.less');

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {text: props.text}
  }
  componentDidMount() {
    this.mainTextArea.focus();
    this.setState({lineCount: this.lineCount()});
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  componentWillReceiveProps(props) {
    this.mainTextArea.value = props.text;
  }
  sendUpdateAfterTimeout() {
    // throttle
    if (this.timer) {
      return;
    }
    this.timer = setTimeout(() => {
      if (this.state.text != this.mainTextArea.value) {
        this.state.text = this.mainTextArea.value;
        this.props.onUpdate(this.mainTextArea.value);
      }
      this.timer = null;
    }, 10 * 1000);
  }
  lineCount() {
    return this.mainTextArea.value.match(/\n/g).length + 1;
  }
  onChange(e) {
    this.setState({lineCount: this.lineCount()});
    this.sendUpdateAfterTimeout();
  }

  render() {
    return (
      <div className="text-editor">
        <textarea ref={(c) => this.mainTextArea = c} defaultValue={this.state.text} onChange={this.onChange.bind(this)} rows={this.state.lineCount}></textarea>
      </div>
    );
  }
}
