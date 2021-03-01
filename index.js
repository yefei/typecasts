'use strict';

const typeCastMap = {
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
};

/**
 * 类型转换
 * type 如果为字符串则使用 typeCastMap 中预定义的类型转换。
 * 使用 type[splitter] 表达式将结果转换为指定类型的列表，不指定 splitter 则默认使用英文逗号,
 * @param {*} value 需要被转换的值
 * @param {string|(value: *) => *} type 转换类型，可以是 typeCastMap 里预定义的，也可自己传转换函数
 * @param {string} [splitter] 列表分隔符，如果没有则为单数据转换
 */
function typeCast(value, type, splitter) {
  if (typeof type === 'string') {
    // number[] 不指定分隔符默认使用 ,
    // number[,]
    const leftI = type.indexOf('[');
    if (leftI > 0) {
      const rightI = type.indexOf(']');
      if (rightI > leftI) {
        splitter = type.substring(leftI+1, rightI) || ',';
        type = type.substring(0, leftI);
      }
    }
    if (typeCastMap[type] === undefined) {
      throw new TypeError('Unknown type cast: ' + type);
    }
    type = typeCastMap[type];
  }

  if (splitter) {
    /** @type {*[]} */
    let list;
    if (typeof value === 'string') {
      list = value.split(splitter);
    } else if (Array.isArray(value)) {
      list = value;
    } else if (value && value[Symbol.iterator]) {
      list = Array.from(value);
    } else {
      list = [value];
    }
    return list.map(type).filter(v => v !== undefined);
  }

  return type(value);
}

/**
 * 挑选输入值并进行类型转换
 * @param {{[key: string]: any}} input
 * @param {*[]} fields
 */
function typeCastPick(input, fields) {
  const out = {};
  fields.forEach(key => {
    if (typeof key === 'object') {
      Object.keys(key).forEach(k => {
        if (input[k] === undefined) return;
        const value = typeCast(input[k], key[k]);
        if (value !== undefined) out[k] = value;
      });
    } else {
      const value = input[key];
      if (value !== undefined) out[key] = value;
    }
  });
  return out;
}

module.exports = {
  typeCast,
  typeCastPick,
};
