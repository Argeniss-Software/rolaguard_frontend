import axios from "axios";
import { createBrowserHistory } from "history"

import AuthStore from "../stores/auth.store";

const API_HOST = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : 'http://localhost:3000';

const API = {
  get: (endpoint, data) => {
    let query = "?";

    for (let key in data) {
      query += "&" + key + "=" + data[key];
    }

    query = query.replace("?&", "?");

    return axios.get(API_HOST + endpoint, data);
  },

  post: (endpoint, data, header) => {
    return axios.post(API_HOST + endpoint, data, header);
  },

  put: (endpoint, data, header) => {
    return axios.put(API_HOST + endpoint, data, header);
  },

  delete: (endpoint, header) => {
    return axios.delete(API_HOST + endpoint, header);
  },

  deleteWithBody: (endpoint, data, headers) => {
    return axios.delete(API_HOST + endpoint, {data: data, headers: headers.headers});
  },

  patch: (endpoint, data, header) => {
    return axios.patch(API_HOST + endpoint, data, header);
  },

  setAuthInterceptor: () => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response) {
          if (error.response.status === 401) {
            AuthStore.clean();
            window.location.href = '/login';
          }
        }

        throw error;
      }
    );
  },
};

export default API;
