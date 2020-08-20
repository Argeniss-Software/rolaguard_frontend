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

  @action getDummyDataForGraphs() {
    return {
      byType: {
        types: [
          { type: "gateway", qty: 5, filter_key: 'id', filter_value: '1' }, 
          { type: "device", qty: 95, filter_key: 'id', filter_value: '2' }
        ],
        total: 100,
      },
      byStauts: {
        status: [
          { type: "connected", qty: 5, filter_key: 'id', filter_value: '1'  },
          { type: "disconnected", qty: 95, filter_key: 'id', filter_value: '1'  },
        ],
        total: 100,
      },
      bySignalStrength: {
        signalStrengths: [
          { qty: 17, text: "0 to -50", unit: "dBm", text: "EXCELLENT", filter_key: 'id', filter_value: '1' },
          { qty: 17, text: "-50 to -75", unit: "dBm", text: "GREAT", filter_key: 'id', filter_value: '2' },
          { qty: 17, text: "-75 to -100", unit: "dBm", text: "OKAY", filter_key: 'id', filter_value: '3' },
          { qty: 17, text: "-100 to -110", unit: "dBm", text: "WEAK", filter_key: 'id', filter_value: '4' },
          { qty: 17, text: "-110 to -120", unit: "dBm", text: "UNUSABLE", filter_key: 'id', filter_value: '5' },
          { qty: 17, text: "-120 to -130", unit: "dBm", text: "DISCONNECTED", filter_key: 'id', filter_value: '6' },
        ],
        total: 100,
      },
      byPacketLost: {
        packet_losts: [
          { qty: 10, text: "between 0 and 10%", filter_key: 'id', filter_value: '1' },
          { qty: 60, text: "between 10 and 20%" , filter_key: 'id', filter_value: '2'}, 
          { qty: 110, text: "between 20 and 30%", filter_key: 'id', filter_value: '3' },
          { qty: 160, text: "between 30 and 40%", filter_key: 'id', filter_value: '4' },
          { qty: 210, text: "between 40 and 50%", filter_key: 'id', filter_value: '5' },
          { qty: 260, text: "between 50 and 60%", filter_key: 'id', filter_value: '6' },
          { qty: 310, text: "between 60 and 70%", filter_key: 'id', filter_value: '7' },
          { qty: 360, text: "between 70 and 80%", filter_key: 'id', filter_value: '8' },
          { qty: 410, text: "between 80 and 90%", filter_key: 'id', filter_value: '9' },
          { qty: 460, text: "between 90 and 100%", filter_key: 'id', filter_value: '10' }
        ],
        total: 100
      }
    };
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
