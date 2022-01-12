import React, { Component } from "react";
import { Modal } from "semantic-ui-react";

import { withRouter } from 'react-router-dom';

class WebhookInfoModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalOpen : true
        };
    }

    handleClose = e => {
        this.setState({modalOpen:false});
        this.props.onClose();
    };

    render(){
        const {modalOpen} = this.state
        return(
            <Modal
                closeOnEscape
                closeIcon
                open={modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>
                    How to use secrets
                </Modal.Header>
                <Modal.Content>
                    <p>
                        The POST requests sended by rolaguard contain a field called signature, 
                        wich is the hexadecimal HMAC of the body. So, in your endpoint you should 
                        use the shared secret and the body to obtain a HMAC and compare it with 
                        the signature field. If they are equal then the request is of trust.
                    </p>
                </Modal.Content>
            </Modal>
        );
    }
}

export default withRouter(WebhookInfoModal);
