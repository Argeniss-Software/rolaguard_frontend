import { observable, action } from "mobx";
import API from "../util/api";
import AuthStore from "./auth.store";

class RolesStore {
  @observable
  rolesList = [];

  @action
  getRolesApi() {
    return API.get("user_roles", {
      headers: { Authorization: "Bearer " + AuthStore.access_token }
    }).then(response => {
      this.rolesList = response.data.user_roles;
      return this.rolesList;
    });
  }

  @action
  getRolesAsString(user) {
    if (user && user.user_roles) {
      let roleString = "";
      user.user_roles.map(role_id => {
        this.rolesList.map(role => {
          if (role_id === role.id) {
            roleString = roleString + role.role_name + ", ";
          }
        });
      });
      roleString = roleString.slice(0, -2);
      return roleString;
    }
  }
}

export default new RolesStore();
