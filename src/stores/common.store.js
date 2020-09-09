import { observable, action, runInAction, computed } from "mobx";
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
      // resolved: _.get(filter_params, "resolved", true),
    };
    return API.get(uri, { headers, params });
  }
}
const store = new CommonStore();
export default store;