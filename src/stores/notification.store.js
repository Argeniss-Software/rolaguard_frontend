import axios from "axios";
import AuthStore from "./auth.store";

const API_HOST = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : 'http://localhost:3000';

class NotificationStore {

    resourceUrl = API_HOST + 'notifications';

    getPreferences() {
        const headers = this.getHeaders();
        return axios.get(`${this.resourceUrl}/preferences`, { headers });
    }

    savePreferences(preferences) {
        const headers = this.getHeaders();
        return axios.put(`${this.resourceUrl}/preferences`, preferences, { headers });
    }

    getCountOfUnread() { 
        const headers = this.getHeaders();
        return axios.get(`${this.resourceUrl}/count`, { headers });
    }

    query(pagination) {
        const { page, size } = pagination;
        const params = { page, size };
        const headers = this.getHeaders();
        return axios.get(this.resourceUrl, { headers, params });
    }

    update(id, notification) {
        const headers = this.getHeaders();
        return axios.patch(`${this.resourceUrl}/${id}`, notification, { headers });
    }

    delete(id) {
        const headers = this.getHeaders();
        return axios.delete(`${this.resourceUrl}/${id}`, { headers });
    }

    activateEmail(token) {
        const headers = this.getHeaders();
        return axios.put(`${this.resourceUrl}/email_activation/${token}`, {}, { headers });
    }

    activatePhone(token) {
        const headers = this.getHeaders();
        return axios.put(`${this.resourceUrl}/phone_activation/${token}`, {}, { headers });
    }

    getHeaders() {
        return { Authorization: "Bearer " + AuthStore.getAccessToken() };
    }
}

export default new NotificationStore()