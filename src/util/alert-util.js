const AlertUtil = {

  colorsOpacityMap: {
    "INFO": "rgba(93, 156, 236, 0.2)",
    "LOW": "rgba(250, 215, 50, 0.2)",
    "MEDIUM": "rgba(255, 144, 43, 0.2)",
    "HIGH": "rgba(240, 80, 80, 0.2)"
  },
  
  colorsMap: {
    "INFO": "#5d9cec",
    "LOW": "#fad732",
    "MEDIUM": "#ff902b",
    "HIGH": "#f05050"
  },

  parameters : {
    toUpper: ['app_key', 'dev_eui', 'gateway', 'dev_addr', 'old_dev_eui', 'new_dev_eui', 'join_eui'],
    shouldNotFix: ['old_latitude', 'new_latitude', 'old_longitude', 'new_longitude']
  },

  alertTypes: {
    notAplicableDescription : ['LAF-402', 'LAF-403']
  },

  alertParameters: {
    "alert_solved": "Alert solved",
    "resolution_reason": "Resolution reason",
    "dev_eui": "DevEUI",
    "dev_addr": "DevAddr",
    "dev_name": "Device Name",
    "dev_vendor": "Device Vendor",
    "counter": "Previous Counter",
    "new_counter": "Counter",
    "prev_packet_id": "Previous Message ID",
    "packet_id": "Current Message ID",
    "packet_date": "Packet date",
    "gateway": "Gateway",
    "gw_name": "Gateway Name",
    "gw_vendor": "Gateway Vendor",
    "created_at": "Created at",
    "app_name": "App Name",
    "app_key": "App Key",
    "join_eui": "AppEUI",
    "packet_type_1": "Message 1 Type",
    "packet_type_2": "Message Type",
    "packet_id_1": "Message 1 ID",
    "packets_lost": "Packets lost",
    "number_of_devices": "Device Count",
    "old_dev_eui": "Old DevEUI",
    "new_dev_eui": "New DevEUI",
    "date": "Date",
    "delta": "Delta",
    "specific_message": "Specific Message",
    "dev_nonce": "Dev Nonce",
    "old_latitude": "Old Latitude",
    "new_latitude": "New Latitude",
    "old_longitude": "Old Longitude",
    "new_longitude": "New Longitude",
    "rssi": "Signal strenght (dBm)",
    "alert_description": "Alert description"
  },

  getParameterHeader(key){
    return this.alertParameters[key] ? this.alertParameters[key] : "";
  },
  
  getColorsMap() {
    return this.colorsMap;
  },
}

export default AlertUtil;
