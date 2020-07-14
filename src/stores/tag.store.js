import { observable, action, computed } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";

class TagsStore {

  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

  @action
  getTags() {
    const headers = this.getHeaders();
    return API.get(`tags`, { headers } );
  }

  @action
  createTag(name, color) {
    const headers = this.getHeaders();
    const params = {
        ...color && { 'color': color },
        ...name && { 'name': name },
    }
    return API.post(`tags?color=${encodeURIComponent(color)}&name=${encodeURIComponent(name)}`, {}, {headers})
  }

  @action
  assignTag( tag, item ){
    const tagId = tag.id;
    const itemType = item.type;
    const itemId = item.id;

    const headers = this.getHeaders();
    const params = {asset_list :[{
      'asset_type': itemType.toLowerCase(),
      'asset_id': itemId,
    }]}

    return API.post(
      `tags/${encodeURIComponent(tagId)}/assets`,
      JSON.stringify(params),
      {headers});
  }

  removeTag( tag, item){
    const tagId = tag.id;
    const itemType = item.type;
    const itemId = item.id;

    const headers = this.getHeaders();
    const params = {
        ...itemType && {'asset_type': itemType},
        ...itemId && {'asset_id': itemId},
    }

    return API.delete(`tags/${tagId}/assets`, { headers, params });
  }

}

export default new TagsStore();
