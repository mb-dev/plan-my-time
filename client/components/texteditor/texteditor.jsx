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
    this.updateStateTimer();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  componentWillReceiveProps() {

  }
  updateStateTimer() {
    this.timer = setTimeout(() => {
      if (this.state.text != this.mainTextArea.value) {
        this.state.text = this.mainTextArea.value;
        console.log('text area updated');
      }
      this.updateStateTimer();
    }, 5000);
  }
  onChange(e) {

  }

  render() {
    return (
      <div className="text-editor">
        <textarea ref={(c) => this.mainTextArea = c} defaultValue={this.state.text} onChange={this.onChange}></textarea>
      </div>
    );
  }
}
