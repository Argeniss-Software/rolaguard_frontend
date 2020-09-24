import { observable, action, computed } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";
import axios from "axios";

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

  assignTag( tag, item ) {
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
      params,
      {headers});
  }

  assignTagToDevices( tag, items) {

    const headers = this.getHeaders();
    const params = {asset_list : items.map((item) => {return {'asset_type': item.type.toLowerCase(),'asset_id':item.id}})}

    return API.post(
      `tags/${encodeURIComponent(tag.id)}/assets`,
      params,
      {headers});
  }

  removeTag( tag, item) {
    const tagId = tag.id;
    const itemType = item.type.toLowerCase();
    const itemId = item.id;

    const headers = this.getHeaders();
    const params = {asset_list :[{
      'asset_type': itemType.toLowerCase(),
      'asset_id': itemId,
    }]}

    return API.delete(`tags/${tagId}/assets`, {headers: headers, data: params});
  }

}

export default new TagsStore();
