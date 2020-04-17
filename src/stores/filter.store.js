import { observable, action, computed} from "mobx";

import API from '../util/api'

class FilterStore {
    @observable filterList = []

    @action setFilter(filter) {
        // console.log("new filter " + filter)
    }

    @computed get getFilters(){
        return this.filterList
    }

}

export default new FilterStore()