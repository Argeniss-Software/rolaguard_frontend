import { observable, action, computed } from "mobx";
import AuthStore from "./auth.store";

import API from "../util/api";

class GeneralDataStore {
  @observable
  dataCollectorsCount = null;


  @action
  getDataCollectorsCount() {
    return API.get(`data_collectors/count`, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.dataCollectorsCount = response.data.count;
    });
  }
}

export default new GeneralDataStore();
