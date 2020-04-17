import { observable, action, computed} from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";
import axios from "axios";

/*
   ALERT
   To show alert you should call showAlert method
   and pass like argument dataBody
   
   DATA BODY
   - icon  : string -> put a icon name from semantic ui react icon list
   - title : string
   - body  : string
   - list  : string[]
   - type  : strin -> ['negative', 'warning', 'positive', 'info']
   - position : string -> ['top-right', 'top-left', 'bottom-right', 'bottom-left']
*/
const API_HOST = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : 'http://localhost:3000';
const AUTO_HIDE_ALERT_TIME = 3000

class AlertStore {

    resourceUrl = API_HOST + 'alerts';

    @observable alertVisible = false
    @observable autoDismiss = true
    @observable alertData = {
        title: "",
        body: "",
        list: [],
        icon: "info",
        type: "info",
        position: "top-right"
    }

    @action showAlert(alertData) {
        if(!this.alertVisible) {
            this.alertData = Object.assign(this.alertData, alertData)
            this.alertVisible = true

            if( this.autoDismiss ) {
                setTimeout(() => this.alertVisible = false, AUTO_HIDE_ALERT_TIME)
            }
        }
    }

    @action hideAlert() {
        this.alertVisible = false
    }

    @computed get getAlertVisible(){
        return this.alertVisible
    }

    @action markAsResolved(alertId, comment) {
        const headers = this.getHeaders()
        return API.put(`alerts/${alertId}/resolve`, { comment } , { headers });
      
    }

    @action query(pagination, criteria = {}) {
        const { type, risk, dataCollector, resolved, from, to } = criteria;
        const { page, size, order } = pagination;
        const params = {
            include_parameters: true,
            ...type && { type },
            ...risk && { risk },
            ...from && { 'created_at[gte]': from },
            ...to && { 'created_at[lte]': to },
            ...(resolved !== undefined && resolved !== null) && { resolved },
            ...dataCollector && { data_collector: dataCollector },
            page,
            size,
            order_by: order
        };
        const headers = this.getHeaders();
        return axios.get(this.resourceUrl, { headers, params });
    }

    @action count(group_by, criteria = {}) {
        const { type, risk, dataCollector, resolved, from, to } = criteria;
        const params = {
            group_by,
            ...type && { type },
            ...risk && { risk },
            ...from && { 'created_at[gte]': from },
            ...to && { 'created_at[lte]': to },
            ...(resolved !== undefined && resolved !== null) && { resolved },
            ...dataCollector && { data_collector: dataCollector }
        };
        const headers = this.getHeaders();
        return axios.get(`${this.resourceUrl}/count`, { headers, params });
    }

    getHeaders() {
        return { Authorization: "Bearer " + AuthStore.access_token };
      }

}

export default new AlertStore()
