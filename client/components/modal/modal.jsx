import React from 'react';

const Modal = (props) => (
  <div className="modal fade in show">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.handleHideModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          { props.title &&
            <h4 className="modal-title">{props.title}</h4>
          }
        </div>
        <div className="modal-body">
          {props.children}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={props.handleHideModal}>Close</button>
          <button type="button" className="btn btn-primary" onClick={props.handleSaveModal}>Save changes</button>
        </div>
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  handleHideModal: React.PropTypes.func.isRequired,
  handleSaveModal: React.PropTypes.func.isRequired,
  children: React.PropTypes.object.isRequired,
  title: React.PropTypes.object,
};

export default Modal;
