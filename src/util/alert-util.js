import _ from 'lodash'
const AlertUtil = {
  colorsOpacityMap: {
    INFO: "rgba(93, 156, 236, 0.2)",
    LOW: "rgba(250, 215, 50, 0.2)",
    MEDIUM: "rgba(255, 144, 43, 0.2)",
    HIGH: "rgba(240, 80, 80, 0.2)",
  },

  colorsMap: {
    INFO: "#5d9cec",
    LOW: "#fad732",
    MEDIUM: "#ff902b",
    HIGH: "#f05050",
  },

  parameters: {
    toUpper: [
      "app_key",
      "dev_eui",
      "gateway",
      "dev_addr",
      "old_dev_eui",
      "new_dev_eui",
      "join_eui",
    ],
    shouldNotFix: [
      "old_latitude",
      "new_latitude",
      "old_longitude",
      "new_longitude",
    ],
    convertToBrowserTime: ["packet_date", "date", "created_at"],
  },

  alertTypes: {
    notAplicableDescription: ["LAF-402", "LAF-403"],
  },

  alertParameters: {
    alert_solved: "Alert solved",
    alert_description: "Alert description",
    resolution_reason: "Resolution reason",
    dev_eui: "DevEUI",
    dev_addr: "DevAddr",
    dev_name: "Device Name",
    dev_vendor: "Device Vendor",
    counter: "Previous Counter",
    new_counter: "Counter",
    prev_packet_id: "Previous Message ID",
    packet_id: "Current Message ID",
    packet_date: "Packet date",
    gateway: "Gateway",
    gw_name: "Gateway Name",
    gw_vendor: "Gateway Vendor",
    created_at: "Created at",
    app_name: "App Name",
    app_key: "App Key",
    join_eui: "AppEUI",
    packet_type_1: "Message 1 Type",
    packet_type_2: "Message Type",
    packet_id_1: "Message 1 ID",
    packets_lost: "Packets lost",
    number_of_devices: "Device Count",
    old_dev_eui: "Old DevEUI",
    new_dev_eui: "New DevEUI",
    date: "Date",
    delta: "Delta",
    specific_message: "Specific Message",
    dev_nonce: "Dev Nonce",
    old_latitude: "Old Latitude",
    new_latitude: "New Latitude",
    old_longitude: "Old Longitude",
    new_longitude: "New Longitude",
    rssi: "Signal strenght (dBm)",
  },
  policy: {
    advance_settings: {
      keys_dictionary: "Keys dictionary",
      location_accuracy: "Location Accuracy",
      max_join_request_fails: "Maximum join request fails",
      disconnection_sensitivity: "Disconnection sensitivity",
      min_activity_period: "Minimum activity period",
      deviation_tolerance: "Deviation tolerance",
      moving_average_weight: "Moving average weight",
      minimum_rssi: "Minimum RSSI",
      minimum_lsnr: "Minimum LSNR",
      jr_tdiff_sensitivity: "Join Request Time difference sensitivity",
      max_lost_packets: "Maximum lost packets",
      time_window: "Time window",
      rssi_sensitivity: "Rssi sensitivity",
      size_sensitivity: "Size sensitivity",
      tdiff_sensitivity: "Time difference sensitivity",
      cdiff_sensitivity: "Cont difference sensitivity",
      max_suspicious: "Maximum suspicious",
      grace_period: "Grace period",
      max_retransmissions: "Maximum retransmissions",
    }
  },
  getPolicyAdvanceSetting(key) {
    return this.policy.advance_settings[key] || _.startCase(key)
  },
  getParameterHeader(key) {
    return this.alertParameters[key] ? this.alertParameters[key] : "";
  },

  getColorsMap() {
    return this.colorsMap;
  },
};

export default AlertUtil;
