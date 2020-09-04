import AuthStore from "./auth.store";
import API from "../util/api";

class InventoryAssetsStore {

  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  getAssets(pagination, criteria) {
    const { page, size } = pagination || {};
    const { vendors, gateways, dataCollectors, tags, type, importances } = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      ...(importances && { importances: importances }),
      page,
      size,
    };
    return API.get(`inventory/list`, { headers, params });
  }

  getAsstesCount() {
    return this.assetsCount;
  }

  getPagesCount() {
    return this.pagesCount;
  }

  getDataCollectorsCount(criteria) {
    const {vendors, gateways, dataCollectors, tags, type, importances} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      ...(importances && { importances: importances })
    }

    return API.get(`inventory/count/data_collector`, { headers, params });
  }

  getGatewaysCount(criteria) {
    const {vendors, gateways, dataCollectors, tags, type, importances} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      ...(importances && { importances: importances })
    }

    return API.get(`inventory/count/gateway`, { headers, params });
  }

  getVendorsCount(criteria) {
    const {vendors, gateways, dataCollectors, tags, type, importances} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      ...(importances && { importances: importances })
    }

    return API.get(`inventory/count/vendor`, { headers, params });
  }

  getTagsCount(criteria) {
    const {vendors, gateways, dataCollectors, tags, type, importances} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      ...(importances && { importances: importances })
    }

    return API.get(`inventory/count/tag`, { headers, params });
  }

  getImportanceCount(criteria) {
    const {vendors, gateways, dataCollectors, tags, type, importances} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      ...(importances && { importances: importances })
    }

    return API.get(`inventory/count/importance`, { headers, params });
  }

  setImportance(importance, assets) {
    /*
     * @param importance: string, defines the importance
     * @param assets: list of asset, must have th id inside each object in the list
     * 
     * @return promise
     */

    const headers = this.getHeaders();
    const body = {
      importance: importance,
      asset_list: assets.map((asset) => {
        return { asset_id: asset.id, asset_type: asset.type.trim().toLowerCase() };
      }),
    };
    return API.post("inventory/set_importance", body, { headers });
  }
}

export default new InventoryAssetsStore();
