import { observable, action, computed } from "mobx";
import API from "../util/api";
import AuthStore from "./auth.store";
import * as HttpStatus from "http-status-codes";

class KeysStore {
  @observable keys = [];
  @observable count = 0;
  @observable keysLoading = false;
  @observable hasError = false;
  @observable errorMessage = "";
  @observable isLoading = true;

  getHeaders() {
    return { headers: { Authorization: "Bearer " + AuthStore.access_token } };
  }

  @action getKeysFromAPI() {
    this.isLoading = true;
    const headers = this.getHeaders();

    API.get("app_keys", headers)
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          this.keys = response.data.keys;
          this.count = response.data.count;
          this.hasError = false;
        } else {
          this.hasError = true;
          this.errorMessage = response.data;
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.hasError = true;
        this.errorMessage = "Network error";
        this.isLoading = false;
      });
  }

  @action addKey(key) {
    /*
      @param key: string with 16 bytes hexadecimal value (32 characters)
    */

    const headers = this.getHeaders();
    const param = { keys: [key] };

    return API.post("app_keys", param, headers).then(() =>
      this.getKeysFromAPI()
    );
  }

  @action deleteKey(key) {
    /*
      @param key: string with 16 bytes hexadecimal value (32 characters)
    */

    const headers = this.getHeaders();
    const param = { keys: [key] };

    return API.deleteWithBody("app_keys", param, headers).then(() =>
      this.getKeysFromAPI()
    );
  }
}

export default new KeysStore();
