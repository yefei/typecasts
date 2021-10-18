'use strict';

module.exports = {
  lt(value, target) {
    return value < target;
  },

  gt(value, target) {
    return value > target;
  },

  eq(value, target) {
    return value == target;
  },

  neq(value, target) {
    return value != target;
  },

  maxLength(value, len) {
    return value.length < len;
  },

  minLength(value, len) {
    return value.length > len;
  },

  in(value, array) {
    return array.indexOf(value) >= 0;
  },

  notIn(value, array) {
    return array.indexOf(value) == -1;
  },

  regexp(value, pattern) {
    return new RegExp(pattern).test(value);
  },

  email(value, is = true) {
    return /^\S+@\S+\.\S+$/.test(value) === is;
  },

  slug(value, is = true) {
    return /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/i.test(value) === is;
  },
};
