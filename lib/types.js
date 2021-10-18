'use strict';

module.exports = {
  number(value) {
    value = Number(value);
    if (!isNaN(value)) return value;
  },
  int(value) {
    value = parseInt(value);
    if (!isNaN(value)) return value;
  },
  float(value) {
    value = parseFloat(value);
    if (!isNaN(value)) return value;
  },
  bool(value) {
    value = String(value).toLowerCase();
    return ['y', '1', 'yes', 'on', 'true'].indexOf(value) !== -1;
  },
  trim(value) {
    if (value) {
      value = String(value).trim();
      if (value) return value;
    }
  },
  string(value) {
    if (value) {
      return String(value);
    }
  },
  origin(value) {
    return value;
  },
  date(value) {
    if (value) {
      value = new Date(value);
      if (value.getTime()) return value;
    }
  },
};
