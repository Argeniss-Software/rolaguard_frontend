import { observable, action } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";
import _ from "lodash";

class ResourceUsageStore {
  @observable criteria = {
    type: null, // device or gateway
    status: null, // connected or disconnected
  };

  @observable statusGraph = {
    // keep status of status graph
    serieSelected: null,
  };

  @action getStatusGraphSerieSelected() {
    return this.statusGraph.serieSelected;
  }
  @action setStatusGraphSerieSelected(data) {
    this.statusGraph.serieSelected = data;
  }

  @action getCriteria() {
    return this.criteria;
  }
  @action deleteCriteria(data) {
    let deleteCriteria = {};
    if (_.isEmpty(data)) {
      this.setStatusGraphSerieSelected(null); // clean selected status element on status graph!
      this.criteria = {
        type: null, // device or gateway
        status: null, // connected or disconnected
      };
    }
    deleteCriteria[_.keys(data)[0]] = null; //todo: fix this for multiple values
    if (_.keys(data)[0] === "status") {
      this.setStatusGraphSerieSelected(null); // clean selected status element on status graph!
    }

    this.setCriteria(deleteCriteria);
  }

  @action setCriteria(data) {
    this.criteria = {
      ...this.criteria,
      ...(_.isFunction(data) ? data.call() : data),
    };
  }

  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  @action getAssets(pagination, criteria) {
    const { page, size } = pagination || {};
    const { status, type, gateways } = criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(gateways && { gateway_ids: gateways }),
      ...(status && { asset_status: status }),
      ...(type && { asset_type: type }),
      page,
      size,
    };
    return API.get(`resource_usage/list`, { headers, params });
  }

  @action getAssetsCountStatus(criteria) {
    const { status, type } = criteria || {};
    const headers = this.getHeaders();
    const params = {
      ...(status && { asset_status: this.criteria.status }),
      ...(type && { asset_type: this.criteria.type }),
    };
    return API.get(`resource_usage/count/status`, { headers, params });
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
        types: [{ label: "Gateway", qty: 5 }, { label: "Device", qty: 95 }],
        total: 100,
      },
      byStauts: {
        status: [
          { label: "Connected", qty: 5 },
          { label: "Disconnected", qty: 95 },
        ],
        total: 100,
      },
      bySignalStrength: {
        signalStrengths: [
          { qty: 17, text: "0 to -50 dBm", additionalText: "EXCELLENT" },
          { qty: 17, text: "-50 to -75 dBm", additionalText: "GREAT" },
          { qty: 17, text: "-75 to -100 dBm", additionalText: "OKAY" },
          { qty: 17, text: "-100 to -110 dBm", additionalText: "WEAK" },
          { qty: 17, text: "-110 to -120 dBm", additionalText: "UNUSABLE" },
          { qty: 17, text: "-120 to -130 dBm", additionalText: "DISCONNECTED" },
        ],
        total: 100,
      },
      byPacketLost: {
        packet_losts: [
          { qty: 10, text: "between 0 and 10%" },
          { qty: 60, text: "between 10 and 20%" },
          { qty: 110, text: "between 20 and 30%" },
          { qty: 160, text: "between 30 and 40%" },
          { qty: 210, text: "between 40 and 50%" },
          { qty: 260, text: "between 50 and 60%" },
          { qty: 310, text: "between 60 and 70%" },
          { qty: 360, text: "between 70 and 80%" },
          { qty: 410, text: "between 80 and 90%" },
          { qty: 460, text: "between 90 and 100%" },
        ],
        total: 100,
      },
    };
  }

  @action getDummyData() {
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
    return data;
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
const store = new ResourceUsageStore();
export default store;
