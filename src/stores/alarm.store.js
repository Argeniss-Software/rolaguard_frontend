import { observable, action, computed } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";

// TODO This file should be named alerts.store.js instead
class AlarmStore {
  @observable alarms = [];
  @observable alertsCount = [];
  @observable alarmsTypes = [];

  getHeaders() {
    return {headers: { Authorization: "Bearer " + AuthStore.access_token }};
  }

  @action
  getAlerts(includeParameters, page, size) {
    return API.get(`alerts?include_parameters=${includeParameters}&page=${page}&size=${size}`, this.getHeaders()).then(response => {
      this.alarms.clear();
      this.alarms = response.data;
      return this.alarms;
    });
  }

  @action
  getAlertsCount( criteria ) {
    const { groupBy, from, to, dataCollectors } = criteria

    return API.get(`alerts/count`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token },
      params: {
        ...groupBy && { 'group_by' : groupBy },
        ...from && { 'created_at[gte]' : from },
        ...to && { 'created_at[lte]' : to },
        ...dataCollectors && { data_collector : dataCollectors }
      }}).then(response => {
      this.alertsCount.clear();
      this.alertsCount.replace(response.data);
      return this.alertsCount;
    });
  }

  @action
  getAlertsType() {
    let query = 'alert_types';
    return API.get(query, this.getHeaders()).then(response => {
      this.alarmsTypes = response.data;
      return this.alarmsTypes;
    });
  }

  @action
  getAlertsTypeCount(from, to) {
    let query = 'alert_types/count';

    return API.get(query, { 
      headers: { Authorization: "Bearer " + AuthStore.access_token }, 
      params: {
        ...from && { "from": from.toISOString() },
        ...to && { "to": to.toISOString() }
      }}).then(response => {
        this.alarmsTypes = response.data;
        return this.alarmsTypes;
    });
  }

}

export default new AlarmStore();
