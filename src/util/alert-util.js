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
    toUpper: ['app_key', 'dev_eui', 'gateway', 'dev_addr', 'old_dev_eui', 'new_dev_eui']
  },

  alertTypes: {
    notAplicableDescription : ['LAF-402']
  },

  alertParameters: {
    "alert_solved": "Alert solved",
    "dev_eui": "DevEUI",
    "dev_addr": "DevAddr",
    "counter": "Previous Counter",
    "new_counter": "Counter",
    "prev_packet_id": "Previous Message ID",
    "packet_id": "Current Message ID",
    "packet_date": "Packet date",
    "gateway": "Gateway",
    "created_at": "Created at",
    "app_key": "App Key",
    "packet_type_1": "Message 1 Type",
    "packet_type_2": "Message Type",
    "packet_id_1": "Message 1 ID",
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
    "new_longitude": "New Longitude"
  },

  getParameterHeader(key){
    return this.alertParameters[key] ? this.alertParameters[key] : "";
  },
  
  getColorsMap() {
    return this.colorsMap;
  },
}

export default AlertUtil;
