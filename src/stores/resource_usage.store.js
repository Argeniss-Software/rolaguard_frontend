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
    data_collectors: [],
    signal_strength: { from: -150, to: 0 },
    packet_lost_range: { from: 0, to: 100 },
  };

  @observable model = {
    list: [],
    isLoading: false,
    totalList: 0,
    totalPages: 0,
    activePage: 1,
    pageSize: 50,
  };

  @observable statusGraph = {
    // keep data related of status graph on resoruce usage dashbaord
    seriesSelected: null,
    isLoading: false,
    series: [],
  };

  @observable gatewaysGraph = {
    // keep data related of gateway graph on resoruce usage dashbaord
    seriesSelected: [],
    isLoading: false,
    series: [],
  };

  @observable packetLostsGraph = {
    // keep data related of gateway graph on resoruce usage dashbaord
    seriesSelected: [],
    isLoading: false,
    series: [],
  };

  @observable signalStrengthGraph = {
    // keep data related of gateway graph on resoruce usage dashbaord
    seriesSelected: [],
    isLoading: false,
    series: [],
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
      this.setModelLoading(false);
    });
  };

  @action getDataStatusFromApi = () => {
    this.setStatusLoading(true);
    const statusPromise = this.getAssetsCount("status");

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
    });
    this.setStatusLoading(false);

    if (!_.isEmpty(this.getStatusGraphSeriesSelected())) {
      this.statusGraph.series.forEach((e) => {
        return (e.selected = e.id === this.getStatusGraphSeriesSelected().id);
      });
    }
  };

  @action getDataGatewaysFromApi = () => {
    this.setGatewaysLoading(true);
    const gatewayPromise = this.getAssetsCount("gateways");

    Promise.all([gatewayPromise]).then((response) => {
      let total = response[0].data.total_count;
      let selectedTotal = 0;
      if (!_.isEmpty(this.getGatewayGraphSeriesSelected())) {
        let seriesSelected = this.getGatewayGraphSeriesSelected();
        selectedTotal = _.sumBy(seriesSelected, "value");
      }
      total -= selectedTotal;
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          label: e.name.toUpperCase(),
          id: e.id,
          selected: !_.isEmpty(this.getGatewayGraphSeriesSelected())
            ? this.getGatewayGraphSeriesSelected()
                .map((i) => i.id)
                .includes(e.id)
            : false,
          percentage: total > 0 ? e.count / total : e.count,
          value: e.count,
          color: ColorUtil.getByIndex(index),
        };
      });
      if (!_.isEmpty(this.getGatewayGraphSeriesSelected())) {
        apiSeries = apiSeries.filter((item) => !item.selected);
      }
      runInAction(() => {
        this.gatewaysGraph.series = apiSeries;
      });
    });

    this.setGatewaysLoading(false);
  };

  @action getDataPacketsLostFromApi = () => {
    const statusPromise = this.getAssetsCount("packet_lost");

    Promise.all([statusPromise]).then((response) => {
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          x: e.name,
          y: e.count,
        };
      });
      runInAction(() => {
        this.packetLostsGraph.series = apiSeries;
      });
    });
  };

  @action getDataSignalStrengthFromApi = () => {
    const statusPromise = this.getAssetsCount("signal_strength");

    Promise.all([statusPromise]).then((response) => {
      let apiSeries = response[0].data.groups.map((e, index) => {
        return {
          x: e.name,
          y: e.count,
        };
      });

      runInAction(() => {
        this.signalStrengthGraph.series = apiSeries;
      });
    });
  };
  /**********************************************************/
  /**********************************************************/

  @action getGatewaysLoading() {
    return this.gatewaysGraph.isLoading;
  }
  @action setGatewaysLoading(val) {
    this.gatewaysGraph.isLoading = val;
  }
  @action getGatewayGraphSeriesSelected() {
    return this.criteria.gateways;
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
    if (elementFoundIndex !== -1) {
      let foundCriteria = this.criteria.gateways.findIndex((e) => {
        return e.id === data.id;
      });
      if (foundCriteria !== -1) {
        this.criteria.gateways.splice(foundCriteria, 1);
      }
    } else {
      // add filter
      this.gatewaysGraph.seriesSelected.push(data);
      this.setCriteria({ gateways: data });
    }
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
      this.setCriteria({
        type: null, // device or gateway
        status: null, // connected or disconnected
        data_collectors: [],
        gateways: [],
        signal_strength: { from: -150, to: 0 },
        packet_lost_range: { from: 0, to: 100 },
      });
    } else {
      let keyCriteriaToDelete = _.keys(data)[0];
      switch (keyCriteriaToDelete) {
        case "status":
          this.setStatusGraphSeriesSelected({}); // clean selected status element on status graph!
          this.setCriteria({ status: null });
          break;
        case "type":
          this.setCriteria({ type: null });
          break;
        case "data_colectors":
          this.setCriteria({ data_collectors: data.data_collectors });
          break;
        case "gateways":
          this.setCriteria({ gateways: data.gateways });
          break;
        case "packet_lost_range":
          this.setCriteria({ packet_lost_range: { from: 0, to: 100 } });
          break;
        case "signal_strength":
          this.setCriteria({ signal_strength: { from: -150, to: 0 } });
          break;
        default:
          break;
      }
    }
  }

  @action loadDataFromApis() {
    this.setActivePage(1); // Automatic call getDataListFromApi
    this.getDataStatusFromApi();
    this.getDataGatewaysFromApi();
    this.getDataPacketsLostFromApi();
    this.getDataSignalStrengthFromApi();
  }

  @action setCriteria(data) {
    let keyCriteriaToDelete = _.keys(data)[0];
    switch (keyCriteriaToDelete) {
      case "status":
      case "type":
        this.criteria = {
          ...this.criteria,
          ...(_.isFunction(data) ? data.call() : data),
        };
        break;
      case "data_collectors":
        this.criteria.data_collectors = data.data_collectors
        break;
      case "gateways":
        let foundItemToDelete = this.criteria.gateways.findIndex(
          (e) => e.id === data[_.keys(data)[0]].id
        );
        if (foundItemToDelete !== -1 && this.criteria.gateways.length > 0) {
          // delete gateway from criteria
          this.criteria.gateways.splice(foundItemToDelete, 1);
        } else {
          // add gateway to criteria
          this.criteria.gateways.push(data.gateways);
        }
        break;
      case "packet_lost_range":
        this.criteria.packet_lost_range.from = data.packet_lost_range.from;
        this.criteria.packet_lost_range.to = data.packet_lost_range.to;
        //this.criteria.type = "device"; // only show packet losts when filter by packet lost
        break;
      case "signal_strength":
        this.criteria.signal_strength.from = data.signal_strength.from;
        this.criteria.signal_strength.to = data.signal_strength.to;
        //this.criteria.type = "device"; // only show devices when filter by signal strength
        break;
      default:
        break;
    }
    this.loadDataFromApis();
  }
  /**********************************************************/
  /**********************************************************/
  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  /* used it on list device and gateway on resrouce ussages */
  @action getAssets(pagination) {
    const { page, size } = pagination || {};
    const { status, type, gateways, packet_lost_range, signal_strength, data_collectors } =
      this.criteria || {};

    const headers = this.getHeaders();
    const params = {
      ...(status && { asset_status: this.criteria.status }),
      ...(type && { asset_type: this.criteria.type }),
      ...(data_collectors && { data_collector_ids: data_collectors }),
      ...(gateways && { gateway_ids: gateways.map((e) => e.id) }),
      ...(packet_lost_range && {
        min_packet_loss:
          packet_lost_range.from === 0 ? null : packet_lost_range.from,
        max_packet_loss:
          packet_lost_range.to === 100 ? null : packet_lost_range.to,
      }),
      ...(signal_strength && {
        min_signal_strength:
          signal_strength.from === -150 ? null : signal_strength.from,
        max_signal_strength:
          signal_strength.to === 0 ? null : signal_strength.to,
      }),
      page,
      size,
    };
    return API.get(`resource_usage/list`, { headers, params });
  }

  // return for graphs associated to resource usage
  @action getAssetsCount(criteria) {
    const { status, type, gateways, packet_lost_range, signal_strength, data_collectors } =
      this.criteria || {};
    const headers = this.getHeaders();

    const params = {
      ...(status && { asset_status: this.criteria.status }),
      ...(type && { asset_type: this.criteria.type }),
      ...(data_collectors && {
        data_collector_ids: this.criteria.data_collectors
      }),
      ...(gateways && {
        gateway_ids: this.criteria.gateways.map((e) => e.id),
      }),
      ...(packet_lost_range && {
        min_packet_loss:
          packet_lost_range.from === 0 ? null : packet_lost_range.from,
        max_packet_loss:
          packet_lost_range.to === 100 ? null : packet_lost_range.to,
      }),
      ...(signal_strength && {
        min_signal_strength:
          signal_strength.from === -150 ? null : signal_strength.from,
        max_signal_strength:
          signal_strength.to === 0 ? null : signal_strength.to,
      }),
    };
    let uri = null;
    switch (criteria) {
      case "status":
        uri = `resource_usage/count/status`;
        break;
      case "gateways":
        uri = `resource_usage/count/gateway`;
        break;
      case "signal_strength":
        uri = `resource_usage/count/signal`;
        break;
      case "packet_lost":
        uri = `resource_usage/count/loss`;
        break;
      default:
        break;
    }
    return API.get(uri, { headers, params });
  }

      
  /* list associated assets for specific devices or gateways */
  @action getAssociatedAssets(filterParams) {
    const { type, id, page, size } = filterParams || {}
    const headers = this.getHeaders();
    let params = {}
    let normalizedType = type.toLowerCase().trim()
    if (normalizedType === 'device') { // device connected to gateways
      params["asset_type"] = 'gateway'
      params['device_ids[]']=id
    } else { // devices associated to gateway
      params["asset_type"] = 'device'
      params['gateway_ids[]']=id
    }
    params['page']=page
    params['size']=size

    return API.get(`resource_usage/list`, { headers, params });
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
          { label: "Transmitting", qty: 5 },
          { label: "Not transmitting", qty: 95 },
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
}
const store = new ResourceUsageStore();
export default store;
