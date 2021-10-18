'use strict';

const typeCastMap = require('./lib/types');
const validateMap = require('./lib/validates');

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
 * @param {{[field: string]: any}} input
 * @param {*[]} fields
 */
function typeCastPick(input, fields) {
  const out = {};
  fields.forEach(field => {
    if (typeof field === 'object') {
      Object.keys(field).forEach(k => {
        let type = field[k];
        let outKey = k;
        let defaultValue;
        let splitter;
        let required = false;
        let validate;
        if (typeof type === 'object') {
          if (type.as) outKey = type.as;
          if (type.default) defaultValue = type.default;
          if (type.splitter) splitter = type.splitter;
          if (type.required) required = type.required;
          if (type.validate) validate = type.validate;
          type = type.type || 'origin';
        }
        const value = typeCast(input[k], type, splitter);
        if (value !== undefined) {
          if (validate) {
            Object.keys(validate).map(name => {
              if (validateMap[name] === undefined) {
                throw new TypeError(`Unknown validate: '${k}' => ${name}`);
              }
              if (!validateMap[name](value, validate[name])) {
                throw new TypeError(`Validate error: '${k}' => ${name}:${validate[name]}`);
              }
            });
          }
          out[outKey] = value;
        }
        else if (defaultValue !== undefined) out[outKey] = defaultValue;
        else if (required) {
          throw new TypeError(typeof required === 'string' ? required : `The field '${k}' is required`);
        }
      });
    } else {
      const value = input[field];
      if (value !== undefined) out[field] = value;
    }
  });
  return out;
}

module.exports = {
  typeCast,
  typeCastPick,
};
