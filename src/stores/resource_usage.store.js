import { observable, action, runInAction, computed } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";
import _ from "lodash";
import ColorUtil from "../util/colors";

class ResourceUsageStore {
  @observable criteria = {
    // kepp data related to criteria filtering on resource usage dashboard
    type: null, // device or gateway
    status: null, // connected or disconnected
    gateways: [],
    signal_strength: [],
    packet_lost_range: { from: 0, to: 100 },
  };

  @observable model = {
    list: [],
    isLoading: false,
    totalList: 0,
    totalPages: 0,
    activePage: 1,
    pageSize: 20,
  };

  @action setModelLoading(val) {
    this.model.isLoading = val;
  }

  @action setTotalList(val) {
    this.model.totalList = val;
  }

  @action setTotalPages(val) {
    this.model.totalPages = val;
  }

  @action setActivePage(val) {
    this.model.activePage = val;
    this.getDataListFromApi();
  }
  @action setPageSize(val) {
    this.model.pageSize = val;
  }

  @action setList(data) {
    this.model.list = data;
  }

  @computed get getTotalList() {
    return this.model.list.length;
  }
  /**********************************************************/
  /**********************************************************/
  @observable statusGraph = {
    // keep data related of status graph on resoruce usage dashbaord
    seriesSelected: null,
    isLoading: false,
    series: [],
  };
  @action getStatusLoading() {
    return this.statusGraph.isLoading;
  }
  @action setStatusLoading(val) {
    this.statusGraph.isLoading = val;
  }
  @action getStatusGraphSeriesSelected() {
    return this.statusGraph.seriesSelected;
  }
  @action setStatusGraphSeriesSelected(data) {
    this.statusGraph.seriesSelected = data;
  }
  @action setStatusGraphSeries(series) {
    this.statusGraph.series = series;
  }

  @action getDataListFromApi = () => {
    // get list of resource usage by criteria
    this.setModelLoading(true);
    const self = this;
    const assetsPromise = this.getAssets(
      { page: this.model.activePage, size: this.model.pageSize },
      this.getCriteria()
    );
    Promise.all([assetsPromise]).then((response) => {
      self.setTotalList(response[0].data.total_items);
      self.setTotalPages(response[0].data.total_pages);
      self.setList(this.formatApiData(response[0].data.assets));
    });
    this.setModelLoading(false);
  };

  @action getDataStatusFromApi = () => {
    this.setStatusLoading(true);
    const statusPromise = this.getAssetsCountStatus();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(this.getStatusGraphSeriesSelected())
            ? e.id === this.getStatusGraphSeriesSelected().id
            : false,
          percentage: !_.isEmpty(this.getStatusGraphSeriesSelected())
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: index === 0 ? "#21ba45" : "#F05050",
        };
      });
      if (!_.isEmpty(this.getStatusGraphSeriesSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      runInAction(() => {
        this.statusGraph.series = apiSeries;
      });
      //this.setStatusGraphSeries(apiSeries);
    });
    this.setStatusLoading(false);

    if (!_.isEmpty(this.getStatusGraphSeriesSelected())) {
      this.statusGraph.series.forEach((e) => {
        return (e.selected = e.id === this.getStatusGraphSeriesSelected().id);
      });
    }
  };

  @action getDataGatewaysFromApi = () => {
    debugger;
    this.setGatewaysLoading(true);
    const statusPromise = this.getAssetsCountGateways();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(this.getGatewayGraphSeriesSelected())
            ? e.id === this.getGatewayGraphSeriesSelected().id
            : false,
          percentage: !_.isEmpty(this.getGatewayGraphSeriesSelected())
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: ColorUtil.getByIndex(index),
        };
      });
      if (!_.isEmpty(this.getGatewayGraphSeriesSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      //this.setGatewayGraphSeries(apiSeries);
      runInAction(() => {
        this.gatewaysGraph.series = apiSeries;
      });
    });

    if (!_.isEmpty(this.getGatewayGraphSeriesSelected())) {
      //_.pluck(this.getGatewayGraphSeriesSelected(), "id")
      if (!_.isEmpty(this.criteria.gateways)) {
        let gatewaysIdSelected = this.criteria.gateways.map((e) => e.id);
        this.gatewaysGraph.series.forEach((e) => {
          return (e.selected = gatewaysIdSelected.includes(e.id));
        });
      }
    }
    this.setGatewaysLoading(false);
  };

  @action getDataPacketsLostFromApi = () => {
    // @ todo: to implement!
    this.setStatusLoading(true);
    const statusPromise = this.getAssetsCountStatus();

    Promise.all([statusPromise]).then((response) => {
      let total = response[0].data.total_count;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(this.getStatusGraphSeriesSelected())
            ? e.id === this.getStatusGraphSeriesSelected().id
            : false,
          percentage: !_.isEmpty(this.getStatusGraphSeriesSelected())
            ? 1
            : total > 0
            ? e.count / total
            : e.count,
          value: e.count,
          color: index === 0 ? "#21ba45" : "#F05050",
        };
      });
      if (!_.isEmpty(this.getStatusGraphSeriesSelected())) {
        apiSeries = apiSeries.filter((item) => item.selected);
      }
      runInAction(() => {
        this.statusGraph.series = apiSeries;
      });
      //this.setStatusGraphSeries(apiSeries);
    });
    this.setStatusLoading(false);

    if (!_.isEmpty(this.getStatusGraphSeriesSelected())) {
      this.statusGraph.series.forEach((e) => {
        return (e.selected = e.id === this.getStatusGraphSeriesSelected().id);
      });
    }
  };
  /**********************************************************/
  /**********************************************************/
  @observable gatewaysGraph = {
    // keep data related of gateway graph on resoruce usage dashbaord
    seriesSelected: [],
    isLoading: false,
    series: [],
  };
  @action getGatewaysLoading() {
    return this.gatewaysGraph.isLoading;
  }
  @action setGatewaysLoading(val) {
    this.gatewaysGraph.isLoading = val;
  }
  @action getGatewayGraphSeriesSelected() {
    return this.gatewaysGraph.seriesSelected;
  }
  @action setGatewayGraphSeries(series) {
    this.gatewaysGraph.series = series;
  }

  @action setGatewayGraphSeriesSelected(data) {
    let elementFoundIndex = -1;
    if (!_.isEmpty(this.gatewaysGraph.seriesSelected) && !_.isEmpty(data)) {
      elementFoundIndex = this.gatewaysGraph.seriesSelected.findIndex((e) => {
        return e.id === data.id;
      });
    }
    if (elementFoundIndex != -1) {
      //remove filter
      this.gatewaysGraph.seriesSelected.splice(elementFoundIndex, 1);
      let foundCriteria = this.criteria.gateways.findIndex((e) => {
        return e.id === data.id;
      });
      if (foundCriteria != -1) {
        this.criteria.gateways.splice(foundCriteria, 1);
      }
    } else {
      // add filter
      this.gatewaysGraph.seriesSelected.push(data);
      this.setCriteria({ gateways: data });
    }
    //    this.gatewaysGraph.seriesSelected = {...this.gatewaysGraph.seriesSelected, ...data}
  }
  /**********************************************************/
  /**********************************************************/
  @action getCriteria() {
    return this.criteria;
  }

  @action deleteCriteria(data) {
    if (_.isEmpty(data)) {
      // clear all
      this.setStatusGraphSeriesSelected({}); // clean selected status element on status graph!
      this.setGatewayGraphSeriesSelected({}); // clean selected status element on status graph!
      this.setCriteria({
        type: null, // device or gateway
        status: null, // connected or disconnected
        gateways: [],
        signal_strength: [],
        packet_lost_range: { from: 0, to: 100 },
      });
    } else {
      let keyCriteriaToDelete = _.keys(data)[0];
      debugger
      switch (keyCriteriaToDelete) {
        case "status":
          this.setStatusGraphSeriesSelected({}); // clean selected status element on status graph!
          this.setStatusGraphSeriesSelected({});
          this.setCriteria({ status: null });
          break;
        case "type":
          this.setCriteria({ type: null });
          break;
        case "gateways":
          this.setGatewayGraphSeriesSelected(data[keyCriteriaToDelete]);
          this.setCriteria({ gateways: data.gateways });
          break;
        case "packet_lost_range":
          this.setCriteria({ packet_lost_range: { from: 0, to: 100 } });
          break;
      }
    }
  }

  @action loadDataFromApis() {
    this.getDataListFromApi();
    this.getDataStatusFromApi();
    this.getDataGatewaysFromApi();
  }
  @action setCriteria(data) {
    let keyCriteriaToDelete = _.keys(data)[0];
    debugger;
    switch (keyCriteriaToDelete) {
      case "status":
      case "type":
        this.criteria = {
          ...this.criteria,
          ...(_.isFunction(data) ? data.call() : data),
        };
        break;
      case "gateways":
        let foundItemToDelete = this.criteria.gateways.findIndex(
          (e) => e.id === data[_.keys(data)[0]].id
        );
        if (foundItemToDelete != -1 && this.criteria.gateways.length > 0) {
          // delete gateway to filter
          this.criteria.gateways.remove(_.keys(data)[0]);
        } else {
          // add gateway to filter
          this.criteria.gateways.push(data.gateways);
        }
        break;
      case "packet_lost_range":
        this.criteria.packet_lost_range.from = data.packet_lost_range.from;
        this.criteria.packet_lost_range.to = data.packet_lost_range.to;
    }
    this.loadDataFromApis();
  }
  /**********************************************************/
  /**********************************************************/
  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  @action getAssets(pagination, criteria) {
    const { page, size } = pagination || {};
    const { status, type, gateways, packet_lost_range } = this.criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(status && { asset_status: this.criteria.status }),
      ...(type && { asset_type: this.criteria.type }),
      ...(gateways && { gateway_ids: gateways.map((e) => e.id) }),
      ...(packet_lost_range && {
        min_packet_loss: packet_lost_range.from,
        max_packet_loss: packet_lost_range.to,
      }),

      page,
      size,
    };
    return API.get(`resource_usage/list`, { headers, params });
  }

  // return resource usage global status (connected/disconnected)
  @action getAssetsCountStatus(criteria) {
    const { status, type, gateways, packet_lost_range } = this.criteria || {};
    const headers = this.getHeaders();
    const params = {
      ...(status && { asset_status: this.criteria.status }),
      ...(type && { asset_type: this.criteria.type }),
      ...(gateways && { gateway_ids: this.criteria.gateways.map((e) => e.id) }),
      ...(packet_lost_range && {
        min_packet_loss: packet_lost_range.from,
        max_packet_loss: packet_lost_range.to,
      }),
    };
    return API.get(`resource_usage/count/status`, { headers, params });
  }

  // return different gateways associated to resource usage
  @action getAssetsCountGateways(criteria) {
    const { status, type, gateways, packet_lost_range } = this.criteria || {};
    const headers = this.getHeaders();
    const params = {
      ...(status && { asset_status: this.criteria.status }),
      ...(type && { asset_type: this.criteria.type }),
      ...(gateways && { gateway_ids: this.criteria.gateways.map((e) => e.id) }),
      ...(packet_lost_range && {
        min_packet_loss: packet_lost_range.from,
        max_packet_loss: packet_lost_range.to,
      }),
    };

    return API.get(`resource_usage/count/gateway`, { headers, params });
  }
  /**********************************************************/
  /**********************************************************/
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
