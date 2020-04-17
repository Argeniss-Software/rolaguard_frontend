import axios from "axios";
import AuthStore from "./auth.store";

const API_HOST = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : 'http://localhost:3000';

class PolicyStore {
    
    resourceUrl = API_HOST + 'policies';

    query(pagination) {
        const { page, size } = pagination;
        const params = { page, size };
        const headers = this.getHeaders();
        return axios.get(this.resourceUrl, { headers, params });
    }

    delete(id) {
        const headers = this.getHeaders();
        return axios.delete(`${this.resourceUrl}/${id}`, { headers });
    }

    get(id) {
        const headers = this.getHeaders();
        return axios.get(`${this.resourceUrl}/${id}`, { headers });
    }

    post(policy) {
        const headers = this.getHeaders();
        return axios.post(this.resourceUrl, policy, { headers });
    }

    put(id, policy) {
        const headers = this.getHeaders();
        return axios.put(`${this.resourceUrl}/${id}`, policy, { headers });
    }

    getHeaders() {
        return { Authorization: "Bearer " + AuthStore.access_token };
    }

}

export default new PolicyStore()