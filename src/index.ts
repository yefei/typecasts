
const validateMap = require('./lib/validates');

import typeCastMap from './types';

export class RequiredError extends Error {
  field: string;
  constructor(field:string, message?:string) {
    super(typeof message === 'string' ? message : `The field '${field}' is required`);
    this.name = 'RequiredError';
    this.field = field;
  }
}

export class ValidateError extends Error {
  field: string;
  value: any;
  validate: string;
  target: any;
  constructor(field:string, validate:string, value:any, target:any) {
    super(`The field '${field}': ${value} ${validate} ${target}`);
    this.name = 'ValidateError';
    this.field = field;
    this.value = value;
    this.validate = validate;
    this.target = target;
  }
}

type Types = keyof typeof typeCastMap;

interface CastOption {
  /**
   * 目标类型，可以是 typeCastMap 里预定义的，也可自己传转换函数
   * @default "origin"
   * */
  type?: Types;

  /** 默认值 */
  default?: any;

  /** 分割为数组 */
  splitter?: string;

  /** 分割数组后最少项目数 */
  minItems?: number;

  /** 分割数组后最大项目数 */
  maxItems?: number;

  /** 是否为必须项 */
  required?: boolean | string;

  /** 结果验证 */
  // validate?: Validates;
};

/**
 * 类型转换
 * type 如果为字符串则使用 typeCastMap 中预定义的类型转换。
 * 使用 type[splitter] 表达式将结果转换为指定类型的列表，不指定 splitter 则默认使用英文逗号,
 * @param value 需要被转换的值
 */
export function typeCast(value:any, opt:CastOption) {
  if (opt.type in typeCastMap) {
    var cast = typeCastMap[opt.type];
  } else {
    throw new TypeError('Unknown type cast: ' + opt.type);
  }

  if (opt.splitter) {
    let list;
    if (typeof value === 'string') {
      list = value.split(opt.splitter);
    } else if (Array.isArray(value)) {
      list = value;
    } else if (value && value[Symbol.iterator]) {
      list = Array.from(value);
    } else {
      list = [value];
    }
    // return list.map(cast).filter(v => v !== undefined);
  }
  return cast(value) as Extract<Types, keyof typeof typeCastMap>;
}

const a = typeCast(111, {
  type: 'bool',
});


function pickTypes<T extends { [field: string]: CastOption }>(config: T) {
  const map = {} as any;
  return map as { [K in keyof T]: ReturnType<typeof typeCastMap[config[K].type]> };
}

const b = pickTypes({
  ddd: {
    type: 'bool',
  }
});

export function typeCastAs(data, type, key) {
  let as = key;
  let splitter;
  let maxItems;
  let minItems;
  let required = false;
  let validate;
  let value;

  if (typeof type === 'object') {
    if (type.as) as = type.as;
    if (type.default) value = type.default;
    if (type.splitter) splitter = type.splitter;
    if (type.maxItems) maxItems = type.maxItems;
    if (type.minItems) minItems = type.minItems;
    if (type.required) required = type.required;
    if (type.validate) validate = type.validate;
    type = type.type || 'origin';
  }

  if (typeof type === 'string') {
    // number[] 不指定分隔符默认使用 ,
    // number[,]
    const leftI = type.indexOf('[');
    if (leftI > 0) {
      const rightI = type.indexOf(']');
      if (rightI > leftI) {
        if (!splitter) {
          splitter = type.substring(leftI+1, rightI) || ',';
        }
        type = type.substring(0, leftI);
      }
    }
  }

  if (required && data === undefined) {
    throw new RequiredError(key, required);
  }

  if (data !== undefined) {
    value = typeCast(data, type, splitter);
    if (value !== undefined) {
      if (Array.isArray(value)) {
        if (maxItems && value.length > maxItems) {
          throw new ValidateError(key, 'maxItems', value.length, maxItems);
        }
        if (minItems && value.length < minItems) {
          throw new ValidateError(key, 'minItems', value.length, minItems);
        }
      }
      if (validate) {
        Object.keys(validate).map(name => {
          if (validateMap[name] === undefined) {
            throw new TypeError(`Unknown validate: '${key}' => ${name}`);
          }
          for (const v of Array.isArray(value) ? value : [value]) {
            if (!validateMap[name](v, validate[name])) {
              throw new ValidateError(key, name, v, validate[name]);
            }
          }
        });
      }
    } else if (required) {
      throw new ValidateError(key, 'cast', data, type);
    }
  }

  return [as, value];
}

/**
 * 挑选输入值并进行类型转换
 * @param {{[field: string]: any}} input
 * @param {*[]} fields
 */
export function typeCastPick(input, fields) {
  const out = {};
  fields.forEach(field => {
    if (typeof field === 'object') {
      Object.keys(field).forEach(k => {
        const [as, value] = typeCastAs(input[k], field[k], k);
        if (value !== undefined) out[as] = value;
      });
    } else {
      const value = input[field];
      if (value !== undefined) out[field] = value;
    }
  });
  return out;
}
