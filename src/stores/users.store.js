import { observable, action } from "mobx";
import AuthStore from "./auth.store";
import API from "../util/api";

import axios from "axios";

const API_HOST = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : 'http://localhost:3000';


class UsersStore {
  @observable usersList = [];
  @observable currentUser = [];

  resourceUrl = API_HOST + 'user';

  @action
  getUserApi() {
    return API.get("user", {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.usersList = response.data.users;
    });
  }

  @action
  getUserByUsernameApi(username) {
    return API.get("user/" + username, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    });
  }
  
  @action
  addUser(user) {
    this.usersList.push(user);
  }

  @action
  updateUser(user) {
    let userData = {
      email: user.email,
      full_name: user.full_name,
      // phone: user.phone.replace(/\D/g, ""),
      phone: user.phone,
      user_roles: user.user_roles
    };

    return API.put("user/" + user.username, userData, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.getUserApi();
    });
  }

  @action
  saveUser(user_to_create) {
    return API.post("register", user_to_create, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
      .then(response => {
        if (response.access_token) {
          this.addUser(response.data);
        }
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  @action
  register(user_to_create, recaptcha_token_to_validate) {

    var data = user_to_create;
    data.recaptcha_token=recaptcha_token_to_validate;

    return API.post("register", data, {})
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  @action
  deleteUser(user) {
    return API.delete("user/" + user.username, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.getUserApi();
    });
  }

  @action
  resendActivation(user) {
    return API.put("resend_activation", user, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.getUserApi();
      return response;
    });
  }

  @action
  createPassword(data) {
    return API.put("create_password/" + data.token, data)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  @action
  changePasswordByRecovery(data) {
    return API.put("change_password_by_recovery/" + data.token, data)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  @action
  changePassword(user) {
    return API.put("change_password", user, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  @action
  changeEmailRequest(user) {
    return API.post("change_email_request", user, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  @action
  confirmEmailChange(user) {
    return API.put("change_email/" + user.token, {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });

  }

  @action
  recoverPassword(data, recaptcha_token_to_validate) {

    data.recaptcha_token=recaptcha_token_to_validate;

    return API.put("password_recovery", data)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error.response;
      });
  }

  query(pagination) {
    const { page, size } = pagination;
    const params = { page, size };
    const headers = this.getHeaders();
    return axios.get(this.resourceUrl, { headers, params });
  }

  getHeaders() {
    return { Authorization: "Bearer " + AuthStore.access_token };
  }

}

export default new UsersStore();
