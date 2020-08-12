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

  isEmpty: text => {
    //check text is not only white spaces
    text = text.replace(/\s+/g, "");
    return text.length === 0 ? true : false;
  },

  isValidPassword: password => {
    const rePassword = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ !\"#$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~]).{8,50}$"
    );
    return rePassword.test(password);
  },

  isValidPhone: phone => {
    const rePhone = new RegExp("^(\\+\\d+)-(\\d+)$");
    return phone && rePhone.test(phone);
  },

  hasWhiteSpaces: text => {
    return text.includes(" ") ? true : false;
  },

  isGravatarImg: text => {
    return text.includes("gravatar.com/avatar/") ? true : false;
  },

  isRegularUser: user => {
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

  isUserAdmin: user => {
    if (user && user.user_roles) {
      return user.user_roles.indexOf(2) !== -1 ? true : false;
    } else {
      return false;
    }
  },
  isValidIp: ip => {
    const blocks = ip.split('.');
    if(blocks.length !== 4) return false;
    for(let i = 0; i < 4; i++) {
      const value = parseInt(blocks[i]);
      if(isNaN(value) || value < 0 || value > 255) return false;
    }
    return true;
  },
  isValidPort: port => {
    const value = parseInt(port);
    return !(isNaN(value) || value <= 0 || value >= 65536);
  },

  isValidTagName: (tagName) => {
    const regex = new RegExp("^[a-zA-Z0-9_. ]+$");
    return regex.test(tagName);
  }
};

export default Validation;
