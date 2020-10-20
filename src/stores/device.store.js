import { observable, action } from "mobx";
import API from "../util/api";
import AuthStore from "./auth.store";

import ArrayUtil from "../util/array";

import moment from "moment";

class DeviceStore {
  @observable devicesCount = 0;
  @observable quarantine = [];
  @observable allQuarantine = [];
  @observable quarantineDeviceCount = null;
  @observable quarantineDeviceCountGrouped = [];
  @observable newDevices = [];
  @observable packets = [];
  @observable packetsCount = null;

  getHeaders() {
    return {headers: { Authorization: "Bearer " + AuthStore.access_token }};
  }

  initFromToMap(from, to) {
    const map = new Map();
    const todayDate = moment( to ).format("YYYY-MM-DD");

    let dateCursor = from;
    while(dateCursor !== todayDate) {
      map.set(dateCursor, 0);
      dateCursor = moment(dateCursor).add(1, 'day').format("YYYY-MM-DD");
    }

    return map;
  }

  mapToArray(dataMap, array) {
    for (const [key, value] of dataMap.entries()) {
      const xValue = moment(key).toDate();
      array.push({xValue: xValue, yValue: value});
    }
  }

  convertArrayToMap(data, dataMap) {
    data.forEach( ({date, count}) => {
      date = date.split(' ')[0];
      dataMap.set(date, count);
    });
  }

  @action
  getNewDevicesCount(criteria) {
    const { groupBy, from, to, dataCollectors } = criteria

    return API.get(`devices/count`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }, 
      params: {
        ...groupBy && { 'group_by': groupBy },
        ...from && { 'last_up_timestamp[gte]': from },
        ...to && { 'last_up_timestamp[lte]': to },
        ...dataCollectors && { data_collector: dataCollectors }
      }})
    .then(response => {
      const dataMap = this.initFromToMap(from, to);
      
      if(groupBy === 'HOUR') {
        this.newDevices.clear();

        let relevantCounts = response.data.filter(item => item.count > 0);
        this.devicesCount = relevantCounts.length > 0 ? Math.max.apply(Math, relevantCounts.map(item => item.count)) : 0;
        ArrayUtil.arrayToVizFormat(response.data, this.newDevices);
      } else {
        this.convertArrayToMap(response.data, dataMap);
        this.newDevices.clear();
        this.mapToArray(dataMap, this.newDevices);

        let relevantCounts = response.data.filter(item => item.count > 0);
        this.devicesCount = relevantCounts.length > 0 ? Math.max.apply(Math, relevantCounts.map(item => item.count)) : 0;
      }

      return this.newDevices;
    });
  }

  @action
  getPacketsCount(criteria) {
    const {groupBy, from, to, dataCollectors} = criteria

    return API.get(`packets/count`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }, 
      params: {
        ...groupBy && { 'group_by': groupBy },
        ...from && { 'date[gte]': from },
        ...to && { 'date[lte]': to },
        ...dataCollectors && { data_collector: dataCollectors }
      }}).then(response => {
        const dataMap = this.initFromToMap(from, to);
        
        if(groupBy === 'HOUR') {
          this.packets.clear();
          ArrayUtil.arrayToVizFormat(response.data, this.packets);
        } else {
          this.convertArrayToMap(response.data, dataMap);
          this.packets.clear();
          this.mapToArray(dataMap, this.packets);
        }

        this.packetsCount = response.data.reduce((previous, item) => previous + item.count, 0);

        return this.packets;
      });
  }

  @action
  getQuarantine(pagination, criteria) {
    const {page, size} = pagination || {}
    const {type, risk, dataCollector } = criteria || {}

    return API.get(`quarantined_devices`, { 
      headers: { Authorization: "Bearer " + AuthStore.access_token }, 
      params: {
        ...page && { page },
        ...size && { size },
        ...type && { 'alerttype': type },
        ...risk && { risk },
        ...dataCollector && { data_collector: dataCollector }
    }}).then(response => {
      this.quarantine = response.data
    });
  }

  @action
  getQuarantineDeviceCount(criteria) {
    const { groupBy, from, to, dataCollectors } = criteria

    return API.get("quarantined_devices/devices_count", { 
      headers: { Authorization: "Bearer " + AuthStore.access_token },
      params: {
        ...groupBy && { 'group_by': groupBy },
        ...from && { 'created_at[gte]': from },
        ...to && { 'created_at[lte]': to },
        ...dataCollectors && { data_collector: dataCollectors } 
      }
    }).then(response => {
      if (groupBy && from && to) {
        const dataMap = this.initFromToMap(from, to);
  
        if(groupBy === 'HOUR') {
          this.quarantineDeviceCountGrouped.clear();
          ArrayUtil.arrayToVizFormat(response.data, this.quarantineDeviceCountGrouped);
        } else if (groupBy === 'DAY') {
          this.convertArrayToMap(response.data, dataMap);
          this.quarantineDeviceCountGrouped.clear();
          this.mapToArray(dataMap, this.quarantineDeviceCountGrouped);
        }

        return;
      }

      this.quarantineDeviceCount = response.data.count;
    });
  }

  @action
  getQuarantineCount(criteria) {
    const {groupBy, type, risk, dataCollector } = criteria || {}

    return API.get("quarantined_devices/count", { 
      headers: { Authorization: "Bearer " + AuthStore.access_token }, 
      params: {
        ...type && { 'alerttype': type },
        ...risk && { risk },
        ...dataCollector && { data_collector: dataCollector },
        ...groupBy && { group_by: groupBy }
    }}).then(response => {
      if (groupBy) {
        return response.data;
      }

      this.quarantineCount = response.data.count;
    });
  }

  @action
  removeQuarantine(item, comment) {
    return API.post("quarantined_devices/remove", {id: item.id, comment }, { headers: {
      Authorization: "Bearer " + AuthStore.access_token
    } }).then(response => {
      this.quarantine.remove(item);
    })
  }

}

export default new DeviceStore();
