import React from 'react'
import {Modal,Button,ModalBody} from 'react-bootstrap'
import CreateChat from './CreateChatForm'


import '../modal_chat.css'

class Addchat extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

 

  render() {
    return (
      <div className="modal-container" style={{ height: 200 }}>
       

        <Modal
          show={this.props.showaddchat}
          onHide={this.props.hide}
          container={this}
          aria-labelledby="contained-modal-title"
          bsSize = "sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Create a Channel
            </Modal.Title>
          </Modal.Header>
          <ModalBody >
           <CreateChat history={this.props.history} />
          </ModalBody>
          
        </Modal>
      </div>
    );
  }
}
  export default Addchat

 /*
  class Addchat extends React.Component {
    constructor(props) {
      super(props);
  
      this.handleHide = this.handleHide.bind(this);
      
      this.state = {
        show: false
      };
    }
  
    handleHide() {
      this.setState({ show: false });
    }
  
    render() {
      return (
        <div className="modal-container" style={{ height: 200 }}>
          <Button
            bsstyle="primary"
            bssize="large"
            onClick={() => this.setState({ show: true })}
          >
            Launch contained modal
          </Button>
  
          <Modal
            show={true}
            onHide={this.handleHide}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                Contained Modal
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Elit est explicabo ipsum eaque dolorem blanditiis doloribus sed id
              ipsam, beatae, rem fuga id earum? Inventore et facilis obcaecati.
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }
  export default Addchat
  */