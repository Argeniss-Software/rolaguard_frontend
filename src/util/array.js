import moment from "moment";

const ArrayUtil = {
  initFromToMap: (from, to) => {
    const map = new Map();
    const todayDate = moment( to ).format("YYYY-MM-DD");

    let dateCursor = from;
    while(dateCursor !== todayDate) {
      map.set(dateCursor, 0);
      dateCursor = moment(dateCursor).add(1, 'day').format("YYYY-MM-DD");
    }

    return map;
  },

  setItemInMap: (item, dataMap, dateAttributeName) => {
    const date = item[dateAttributeName].split(' ')[0];
    let mapItem = dataMap.get(date);
    
    mapItem++;
    dataMap.set(date, mapItem);
  },

  mapToArray: (dataMap) => {
    const array = [];
    for (const [key, value] of dataMap.entries()) {
      const xValue = moment(key).format("MM/DD/YYYY");
      array.push({xValue: xValue, yValue: value});
    }

    return array;
  },

  convertArrayToMap: (data, dataMap) => {
    data.forEach( ({date, count}) => {
      date = date.split(' ')[0];
      dataMap.set(date, count);
    });
  },

  arrayToVizFormat(srcArray, dstArray) {
    srcArray.forEach((item) => {
      dstArray.push({xValue: new Date(item.hour), yValue: item.count});
    })
  }

}

export default ArrayUtil;