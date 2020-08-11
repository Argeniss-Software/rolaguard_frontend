import { observable, action, computed } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";
import { Table } from "semantic-ui-react";

class InventoryAssetsStore {
  @observable assets = [];
  @observable dataCollectors = [];
  @observable gateways = [];
  @observable vendors = [];
  @observable assetsCount = null;
  @observable pagesCount = null;
  @observable assetsTypes = [];

  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  @action
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
    return API.get(`inventory/list`, { headers, params} );
  }

  getAsstesCount(){
    return this.assetsCount;
  }

  getPagesCount(){
    return this.pagesCount;
  }
  
  getMockupAssets(){
    {/* Just for mockup reasons */}

    const assets = [
      {
          "id": "c0ee40ffff2942fd",
          "type": "Gateway",
          "name": "Patronix-R25",
          "vendor": null
      },
      {
          "id": "c0ee40ffff2942b6",
          "type": "Gateway",
          "name": null,
          "vendor": null
      },
      {
          "id": "c0ee40ffff2940fa",
          "type": "Gateway",
          "name": null,
          "vendor": null
      },
      {
          "id": "c0ee40ffff29661f",
          "type": "Gateway",
          "name": "Patronix-R11",
          "vendor": null
      },
      {
          "id": "c0ee40ffff2942b9",
          "type": "Gateway",
          "name": null,
          "vendor": null
      }
    ];

    this.assets = assets;
    return this.assets;
  }


  getDataCollectorsCount(criteria){
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


  getMockupDataCollectors() {
    const dataCollectors = [
      {
        "label":"ChirpStack1",
        "percentage":0.9,
        "value":81,
        "id":48,
     },
     {
        "label":"ChirpStack2",
        "percentage":0.1,
        "value":9,
        "id":6,
     }
    ];

    this.dataCollectors = dataCollectors;
    return this.dataCollectors;
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
  getMockupGateways() {
    const gateways = [
      {
        "label": "Devices",
        "percentage": 0.8461538461538461,
        "value": 11,
        "id": "Devices",
        "selected": false
      },
      {
        "label": "Gateways",
        "percentage": 0.15384615384615385,
        "value": 2,
        "id": "Gateways",
        "selected": false
      }
    ];

    this.gateways = gateways;
    return this.gateways;
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

  getMockupVendors() {
    const vendors =  [
      {
         "label":"Vendor1",
         "selected":true,
         "percentage":0.9,
         "value":90,
      },
      {
         "label":"Vendor2",
         "percentage":0.1,
         "value":10,
      }
   ];

   this.vendors = vendors;
   return this.vendors;
  }

}

export default new InventoryAssetsStore();
