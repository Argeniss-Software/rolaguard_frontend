import * as React from 'react';
import { observer, inject } from "mobx-react"
import { Message } from 'semantic-ui-react'

@inject('alertStore')
@observer
class AlertComponent extends React.Component {

    handleDismmiss = () => {
        this.props.alertStore.hideAlert()
    }
    
    render() {
        const { alertData } = this.props.alertStore
    
        let className = `${ alertData.type } ${ alertData.position }`

        return (
            <Message 
                onDismiss={ this.handleDismmiss }
                icon={ alertData.icon ? alertData.icon : "" } 
                header={ alertData.title ? alertData.title : "" } 
                content={ alertData.body ? alertData.body : "" } 
                // list={ alertData.list ? alertData.list : [] }
                className={ className }
            />
        )
    }
}

export default AlertComponent