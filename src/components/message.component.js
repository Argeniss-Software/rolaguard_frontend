import * as React from 'react';
import { intercept } from 'mobx'
import { observer, inject } from "mobx-react"
import { Modal, Icon, Header, Button } from 'semantic-ui-react'

@inject('messageStore')
@observer
class MessageComponent extends React.Component {
    render() {
        return (
            <Modal
                open={this.props.messageStore.getModalState}
                basic
                size='small'
            >
                <Header icon='browser' content={ this.props.messageStore.getModalTitle} />
                <Modal.Content>
                    <h3>{ this.props.messageStore.getModalMessage }</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => { this.props.messageStore.closeModal() }} inverted>
                        <Icon name='checkmark' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default MessageComponent