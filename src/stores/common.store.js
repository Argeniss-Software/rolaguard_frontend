import { action } from "mobx"; // observable,runInAction, computed
import AuthStore from "./auth.store";
import API from "../util/api";
import _ from "lodash";

class CommonStore {
  /**********************************************************/
  /**********************************************************/
  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  /* used it on list device and gateway on resource usages */
  @action getData(type, asset_params, filter_params) {
    const headers = this.getHeaders();
    let uri = `inventory/${asset_params.type}/${asset_params.id}`;
    switch (type) {
      case "inventory":
        // <asset_type>/<int:asset_id>
        break;
      case "alerts":
        /* possible query params: 
          - created_at[gte],  
          - created_at[lte],  
          - type = laf-402, laft-403, etc.
          - resolved: boolean
          - risk: medium, hight, etc.
          - order_by: created_at[gte] asc, risk asc
          - page: 1
          - size: 20
        */
        uri = uri + "/alerts";
        break;
      case "current_issues":
        /* possible query params: 
          - created_at[gte],  
          - created_at[lte],  
          - type = laf-402, laft-403, etc.
          - resolved: boolean
          - risk: medium, hight, etc.
          - order_by: created_at[gte] asc, risk asc
          - page: 1
          - size: 20
        */
        uri = uri + "/issues";
        break;
      case "resource_usage":
        uri = `resource_usage/${asset_params.type}/${asset_params.id}`;
        break;
      default:
        break;
    }

    const params = {
      page: _.get(filter_params, "page", 1),
      size: _.get(filter_params, "size", 5),
      order_by: _.get(filter_params, "order_by", []),
      "created_at[gte]": _.get(filter_params, "created_at[gte]", null),
      "created_at[lte]": _.get(filter_params, "created_at[lte]", null),
      min_rssi: _.get(filter_params, "min_rssi", null),
      max_rssi: _.get(filter_params, "max_rssi", null),
      min_lsnr: _.get(filter_params, "min_lsnr", null),
      max_lsnr: _.get(filter_params, "max_lsnr", null),
    };
    return API.get(uri, { headers, params });
  }

  /**
   * search asset by different fields (device or gateway globally)
   * 
   * @param {string} search_param string to search
   */
  @action searchAssets(search_param) {
    const headers = this.getHeaders();
    let uri = 'assets';
    const params = {
      search_param: search_param,
    }
    return API.get(uri, { headers, params });
  }
}
const store = new CommonStore();
export default store;