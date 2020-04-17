import { observable, action } from "mobx";
import API from "../util/api";
import {connect, emit, disconnect} from "../util/web-socket";

class AuthStore {

  constructor() {
    this.username = localStorage.getItem('user_username');
    this.refresh_token = localStorage.getItem('refresh_token');
    this.access_token = localStorage.getItem('token');
  }

  @observable username = "";
  @observable type = "";
  @observable description = "";
  @observable access_token = "";
  @observable refresh_token = "";
  @observable organization_id = 0;
  @observable recaptcha_token = null;

  timeoutId = null;

  @action
  setUser(user) {
    this.username = user.username || "";
    this.password = user.password || "";
    this.access_token = user.access_token || "";
    this.refresh_token = user.refresh_token || "";
    this.organization_id = user.organization_id || 1;
  }

  @action
  setRefreshToken(refreshToken) {
    this.refresh_token = refreshToken;
  }

  @action
  login(auth) {
    return API.post("login", auth)
      .then(response => {
        this.access_token = response.data.access_token;
        this.refresh_token = response.data.refresh_token;

        localStorage.setItem("token", this.access_token);
        localStorage.setItem("refresh_token", this.refresh_token);
        connect();
        let expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 10);
        localStorage.setItem("expiration_time", expirationDate );

        return response;
      })
      .catch(err => {
        return err.response;
      });
  }

  @action
  refreshToken() {
    return new Promise((pass, reject) => {
      let refreshToken = localStorage.getItem("refresh_token");

      let headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + refreshToken
        }
      };

      API.post(
        "token_refresh",
        {
          access_token: refreshToken
        },
        headers
      ).then(response => {
        this.access_token = response.data.access_token;
        localStorage.setItem("token", response.data.access_token);
        emit('authorization', {token: this.access_token});
        let expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 10);
        localStorage.setItem("expiration_time", expirationDate );
        pass(response);
      });
    });
  }

  @action
  clean(user) {
    this.username = "";
    this.password = "";
    this.access_token = "";
    this.refresh_token = "";
    this.organization_id = "";

    localStorage.removeItem("token");
    localStorage.removeItem("expiration_time");
    localStorage.removeItem("refresh_token");

    disconnect();
    clearTimeout(this.timeoutId);
  }

  @action
  setCaptcha(value) {
    this.recaptcha_token = value;
  }

  scheduleRefreshToken() {
    var time_token = new Date(localStorage.getItem("expiration_time"))
    var time_now = new Date();
    var dif = time_token.getTime() - time_now.getTime();

    this.timeoutId = setTimeout(() => {
        this.refreshToken().then((response) => {
            this.scheduleRefreshToken();
        })
    }, dif);
  }

  getAccessToken() {
    return localStorage.getItem("token");
  }
}

export default new AuthStore();
