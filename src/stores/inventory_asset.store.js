import { observable, action, computed } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";

class InventoryAssetsStore {
  @observable assets = [];
  @observable dataCollectors = [];
  @observable gateways = [];
  @observable vendors = [];
  @observable assetsCount = [];
  @observable assetsTypes = [];

  getHeaders() {
    return {headers: { Authorization: "Bearer " + AuthStore.access_token }};
  }

  @action
  getAssets(includeParameters, page, size) {
    return API.get(`inventory?page=${page}&size=${size}`, this.getHeaders()).then(response => {
      this.assets.clear();
      this.assets = response.data;
      return this.assets;
    });
  }

  @action
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

  getMockupDataCollectors() {
    const dataCollectors = [
      {
        "label":"ChirpStack1",
        "percentage":0.9,
        "value":81,
        "id":48,
        "color":"#38b9dc"
     },
     {
        "label":"ChirpStack2",
        "percentage":0.1,
        "value":9,
        "id":6,
        "color":"#1f77b4"
     }
    ];

    this.dataCollectors = dataCollectors;
    return this.dataCollectors;
  }

  getMockupGateways() {
    const gateways = [
      {
        "label": "Devices",
        "percentage": 0.8461538461538461,
        "value": 11,
        "color": "#ff902b",
        "id": "Devices",
        "selected": false
      },
      {
        "label": "Gateways",
        "percentage": 0.15384615384615385,
        "value": 2,
        "color": "#f05050",
        "id": "Gateways",
        "selected": false
      }
    ];

    this.gateways = gateways;
    return this.gateways;
  }

  getMockupVendors() {
    const vendors =  [
      {
         "label":"Vendor1",
         "selected":true,
         "percentage":0.9,
         "value":90,
         "color":"#f05050"
      },
      {
         "label":"Vendor2",
         "percentage":0.1,
         "value":10,
         "color":"#5d9cec"
      }
   ];

   this.vendors = vendors;
   return this.vendors;
  }

}

export default new InventoryAssetsStore();
