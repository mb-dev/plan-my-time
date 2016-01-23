import _ from 'lodash'
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
  lineCount() {
    return this.mainTextArea.value.match(/\n/g).length + 1;
  }
  onChange(e) {
    this.setState({lineCount: this.lineCount()});
    this.state.text = this.mainTextArea.value;
    this.props.onUpdate(this.mainTextArea.value);
  }

  render() {
    return (
      <div className="text-editor">
        <textarea ref={(c) => this.mainTextArea = c} defaultValue={this.state.text} onChange={_.debounce(this.onChange.bind(this), 2000, {maxWait: 10000})} rows={this.state.lineCount}></textarea>
      </div>
    );
  }
}
