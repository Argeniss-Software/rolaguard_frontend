import { observable, action, computed } from "mobx";
import axios from "axios";

import API from "../util/api";
import AuthStore from "./auth.store";

const API_HOST = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : 'http://localhost:3000';

class DataCollectorStore {
    @observable dataCollectorList = [];
    @observable dataCollectorsCount = 0;
    @observable dataCollectorTypes = [];

    resourceUrl = API_HOST + 'data_collectors';

    @action
    getDataCollectorApi(from = null, to = null) {
      const params = {
        ...(from || to) && {'include_count': true},
        ...from && { from },
        ...to && { to }
      }
        return new Promise( (success, reject) => {
            API.get("data_collectors", {
                headers: { Authorization: "Bearer " + AuthStore.access_token }, params
            }).then(response => {
                
                if(response.data.data_collectors){
                    
                    success(response.data.data_collectors)
                    
                    this.dataCollectorList = response.data.data_collectors;
                } else {
                    success( [] )
                }
            }).catch((error) => {
                reject([])
            })
        })
    }

  @action
  addDataCollector(dataCollector) {
    this.dataCollectorList.push(dataCollector);
  }

  
  @action
  updateDataCollector(id, dataCollector) {
    return API.put("data_collectors/" + id, dataCollector, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.getDataCollectorApi()
    });
  }
  
  @action
  getDataCollectorById(dataCollectorId) {
    return API.get(`data_collectors/${ dataCollectorId }`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
  }

  saveDataCollector(dataCollector) {
    const headers = { Authorization: "Bearer " + AuthStore.getAccessToken() };
    return API.post("data_collectors", dataCollector, { headers })
    .then(response => { 
      this.getDataCollectorApi()
    });
  }

  @action
  deleteDataCollector(dataCollector) {
    return API.delete("data_collectors/" + dataCollector.id,  {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.getDataCollectorApi();
    });
  }

  @computed
  get getDataCollectors() {
    return this.dataCollectorList;
  }

  @action
  getDataCollectorTypes() {
    return API.get(`data_collector_types`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
  }

  @action
  getDataCollectorTTNRegions() {
    return API.get(`data_collectors/ttn_regions`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
  }

  @action
  getDataCollectorsActivity() {
    return API.get(`data_collectors/activity`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
  }

  updatePartially(id, dataCollector) {
    return API.patch(`data_collectors/${id}`, dataCollector, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
    });
  }

  saveTTNCredentials(user, password) {
    const headers = { Authorization: "Bearer " + AuthStore.getAccessToken() };
    return API.post("data_collectors/ttn_v2_credentials",  {user, password} , { headers });
  }

  saveTTN3Credentials(region_id, gateway_api_key) {
    const headers = { Authorization: "Bearer " + AuthStore.getAccessToken() };
    return API.post("data_collectors/ttn_v3_credentials",  {region_id,gateway_api_key} , { headers });
  }

  getTTNGateways(dataCollectorTypeCode) {
    const headers = { Authorization: "Bearer " + AuthStore.getAccessToken() };
    return API.get("data_collectors/user_gateways", dataCollectorTypeCode, { headers } );
  }

  query(pagination) {
    const { page, size } = pagination;
    const params = { page, size };
    const headers = this.getHeaders();
    return axios.get(this.resourceUrl, { headers, params });
  }

  queryLog(dataCollectorId, pagination) {
    const { page, size } = pagination;
    const params = { page, size };
    const headers = this.getHeaders();
    return axios.get(`${this.resourceUrl}/${dataCollectorId}/log`, { headers, params });
  }

  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

}

export default new DataCollectorStore();
