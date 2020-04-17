import * as React from 'react';
import { observer, inject } from "mobx-react"
import { Redirect } from 'react-router-dom'

@inject('authStore')
@observer
class AuthComponent extends React.Component {

    checkExpirationTime = () => {
        var MAX_TIME = 3600
        var MIN_TIME = 800

        var time_token = new Date(localStorage.getItem("expiration_time"))
        var time_now = new Date();
        var dif = time_token.getTime() - time_now.getTime();

        var diffSeconds = dif / 1000;
        var seconds = Math.abs(diffSeconds);

        return MAX_TIME > seconds && MIN_TIME < seconds
    }

    componentDidMount() {
        let token = localStorage.getItem("token")

        if(token) {
            this.props.authStore.scheduleRefreshToken();
        }
    }

    render() {
        const { authStore, component } = this.props

        let token = localStorage.getItem("token")

        if(token) {
            authStore.access_token = token
            return (
                ( component )
            )
        } else {
            return <Redirect to="/login" />
        }
    }
}

export default AuthComponent