import { observable, action } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";

class ResourceUssageStore {
  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  @action getAssets(pagination, criteria) {
    const { page, size } = pagination || {};
    const { vendors, gateways, dataCollectors, tags, type } = criteria || {};
    this.assets = [];
    
    const headers = this.getHeaders();
    const params = {
      ...(vendors && { vendors: vendors }),
      ...(gateways && { gateway_ids: gateways }),
      ...(dataCollectors && { data_collector_ids: dataCollectors }),
      ...(tags && { tag_ids: tags }),
      ...(type && { asset_type: type }),
      page,
      size,
    };
    return API.get(`resource_usage/list`, { headers, params });
  }

  @action formatApiData(data) {
    data.map((e) => {
      // preprocess data!
      e.type =
        e.type && !["gateway", "device"].includes(e.type.toLowerCase().trim())
          ? "unknown"
          : e.type.toLowerCase().trim();
      e.packets_down = {
        ...{
          total: "-",
          per_minute: "-",
          per_hour: "-",
          per_day: "-",
          percentage: "-",
        },
        ...e.packets_down,
      };
      e.packets_up = {
        ...{
          total: "-",
          per_minute: "-",
          per_hour: "-",
          per_day: "-",
          percentage: "-",
        },
        ...e.packets_up,
      };
      e.packets_lost = {
        ...{
          total: "-",
          per_minute: "-",
          per_hour: "-",
          per_day: "-",
          percentage: "-",
        },
        ...e.packets_lost,
      };
    });
    return { data: data };
  }

  @action getDummyData(){
    let data = [
      {
        hex_id: "FFFFFFFFFF",
        name: "device name",
        type: "device",
        connected: true,
        max_rssi: 50,
        id: 1,
        data_collector: "Chirpstack.io",
        app_name: null,
        packets_down: {
          total: 3306,
          per_minute: 4.894177805965373,
          per_hour: 293.65066835792237,
          per_day: 7047.616040590136,
          percentage: 56.59020883259158,
        },
        packets_lost: {
          total: 3306,
          per_minute: 4.894177805965373,
          per_hour: 293.65066835792237,
          per_day: 7047.616040590136,
          percentage: 56.59020883259158,
        },
        packets_up: {
          total: 2536,
          per_minute: 3.754275534158556,
          per_hour: 225.25653204951337,
          per_day: 5406.15676918832,
          percentage: 43.40979116740842,
        },
      },
      {
        hex_id: "0000000000",
        name: "gateway name",
        type: "gateway",
        connected: true,
        max_rssi: 50,
        id: 1,
        data_collector: "Chirpstack.io",
        app_name: null,
        packets_down: {
          total: 3306,
          per_minute: 4.894177805965373,
          per_hour: 293.65066835792237,
          per_day: 7047.616040590136,
          percentage: 56.59020883259158,
        },
        packets_lost: {
          total: 3306,
          per_minute: 4.894177805965373,
          per_hour: 293.65066835792237,
          per_day: 7047.616040590136,
          percentage: 56.59020883259158,
        },
        packets_up: {
          total: 2536,
          per_minute: 3.754275534158556,
          per_hour: 225.25653204951337,
          per_day: 5406.15676918832,
          percentage: 43.40979116740842,
        },
      },
    ]; 
    return data
  }
  /*@action
  getAssets(pagination, criteria) {
    const { page, size } = pagination || {};
    const { vendors, gateways, dataCollectors, tags, type} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...vendors && {'vendors': vendors},
      ...gateways && {'gateway_ids': gateways},
      ...dataCollectors && {'data_collector_ids': dataCollectors},
      ...tags && {'tag_ids': tags},
      ...type && {'asset_type': type},
      page,
      size
    };
    return API.get(`resource_usage/list`, { headers, params} );
  }*/

  /*getAsstesCount(){
    return this.assetsCount;
  }

  getPagesCount(){
    return this.pagesCount;
  }*/

  /*getDataCollectorsCount(criteria){
    const { vendors, gateways, dataCollectors, tags, type} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...vendors && {'vendors': vendors},
      ...gateways && {'gateway_ids': gateways},
      ...dataCollectors && {'data_collector_ids': dataCollectors},
      ...tags && {'tag_ids': tags},
      ...type && {'asset_type': type},
    };

    return API.get(`inventory/count/data_collector`, { headers, params} );
  }

  getGatewaysCount(criteria){
    const { vendors, gateways, dataCollectors, tags, type} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...vendors && {'vendors': vendors},
      ...gateways && {'gateway_ids': gateways},
      ...dataCollectors && {'data_collector_ids': dataCollectors},
      ...tags && {'tag_ids': tags},
      ...type && {'asset_type': type},
    };

    return API.get(`inventory/count/gateway`, { headers, params} );
  }

  getVendorsCount(criteria){
    const { vendors, gateways, dataCollectors, tags, type} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...vendors && {'vendors': vendors},
      ...gateways && {'gateway_ids': gateways},
      ...dataCollectors && {'data_collector_ids': dataCollectors},
      ...tags && {'tag_ids': tags},
      ...type && {'asset_type': type},
    };

    return API.get(`inventory/count/vendor`, { headers, params} );
  }

  getTagsCount(criteria){
    const { vendors, gateways, dataCollectors, tags, type} = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...vendors && {'vendors': vendors},
      ...gateways && {'gateway_ids': gateways},
      ...dataCollectors && {'data_collector_ids': dataCollectors},
      ...tags && {'tag_ids': tags},
      ...type && {'asset_type': type},
    };

    return API.get(`inventory/count/tag`, { headers, params} );
  }*/
}
const store = new ResourceUssageStore();
export default store;
