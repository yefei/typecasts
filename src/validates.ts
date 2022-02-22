export default {
  lt(value, target) {
    return value < target;
  },

  lte(value, target) {
    return value <= target;
  },

  gt(value, target) {
    return value > target;
  },

  gte(value, target) {
    return value >= target;
  },

  eq(value, target) {
    return value == target;
  },

  neq(value, target) {
    return value != target;
  },

  maxLength(value, len) {
    return value.length <= len;
  },

  minLength(value, len) {
    return value.length >= len;
  },

  in(value, array) {
    return array.indexOf(value) >= 0;
  },

  notIn(value, array) {
    return array.indexOf(value) == -1;
  },

  regexp(value, pattern) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern);
    }
    return pattern.test(value);
  },

  email(value, is = true) {
    return /^\S+@\S+\.\S+$/.test(value) === is;
  },

  slug(value, is = true) {
    return /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/i.test(value) === is;
  },

  /**
   * @param {string} value 
   * @param {string[]} protocols 
   */
  url(value, protocols) {
    let is = true;
    if (typeof protocols === 'boolean') {
      is = protocols;
      protocols = ['http', 'https'];
    }
    const [_protocol, _addr] = value.split('://', 2);
    if (_protocol && _addr && protocols.indexOf(_protocol.toLowerCase()) > -1)
      return /^([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(_addr) === is;
    return !is;
  },
};
