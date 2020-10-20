import { observable } from "mobx";

/*
 The idea of this store is to save the global config of the app
*/
class GlobalConfigStore {
  @observable lang = "en";

  @observable dateFormats = {
    moment: {
      dateTimeFormat: "MM/DD/YY hh:mm:ss A",
    },
    apexchart: {
      dateTimeFormat: "MM/dd/yy hh:mm:ss TT",
    },
  };
}
const store = new GlobalConfigStore();
export default store;
