import isValidHostname from "is-valid-hostname";
import validator from "validator";

const Validation = {
  isValidUsername: (username) => {
    const regex = new RegExp("^[a-z0-9-_.]{3,32}$");
    return regex.test(username);
  },

  hasLength: (text, length) => {
    return text.length < length ? false : true;
  },

  exceedsEmailLength: (text) => {
    return text.length > 320;
  },

  exceedsFullNameLength: (text) => {
    return text.length > 64;
  },

  isEmpty: (text) => {
    //check text is not only white spaces
    text = text.replace(/\s+/g, "");
    return text.length === 0 ? true : false;
  },

  isValidPassword: (password) => {
    const rePassword = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ !\"#$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~]).{8,50}$"
    );
    return rePassword.test(password);
  },

  isValidPhone: (phone) => {
    const rePhone = new RegExp("^(\\+\\d+)-(\\d+)$");
    return phone && rePhone.test(phone);
  },

  hasWhiteSpaces: (text) => {
    return text.includes(" ") ? true : false;
  },

  isGravatarImg: (text) => {
    return text.includes("gravatar.com/avatar/") ? true : false;
  },

  isRegularUser: (user) => {
    if (user && user.user_roles) {
      /* if (user.user_roles.indexOf(8) !== -1) {
        return true;
      }
      */
      return user.user_roles.indexOf(1) !== -1 ? true : false;
    } else {
      return false;
    }
  },

  isUserAdmin: (user) => {
    if (user && user.user_roles) {
      return user.user_roles.indexOf(2) !== -1 ? true : false;
    } else {
      return false;
    }
  },

  isValidIp: (ip) => {
    return validator.isIP(ip);
  },

  isValidURL: (text) => {
    return validator.isURL(text);
  },

  isValidHostname: (text) => {
    return validator.isFQDN(text);
  },

  isValidPort: (port) => {
    return validator.isPort(port);
  },

  isValidTagName: (tagName) => {
    const regex = new RegExp("^[a-zA-Z0-9_. ]+$");
    return regex.test(tagName);
  },

  isValidKey: (key) => {
    const regex = new RegExp("^[A-F0-9]{32}$");
    return regex.test(key.toUpperCase());
  },

  isValidKeyIncomplete: (key) => {
    const regex = new RegExp("^[A-F0-9]{0,32}$");
    return regex.test(key.toUpperCase());
  },
};

export default Validation;
