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
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  componentWillReceiveProps() {

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
    }, 5000);
  }
  onChange(e) {
    this.sendUpdateAfterTimeout();
  }

  render() {
    return (
      <div className="text-editor">
        <textarea ref={(c) => this.mainTextArea = c} defaultValue={this.state.text} onChange={this.onChange.bind(this)}></textarea>
      </div>
    );
  }
}
