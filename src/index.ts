import typeCastMap from './types';
import validateMap from './validates';

/**
 * 所有支持的转换类型名称
 */
export type TypeKeys = keyof typeof typeCastMap;

/**
 * 类型名称对应的类型
 */
export type TypeMap = { [K in TypeKeys]: ReturnType<typeof typeCastMap[K]> };

/**
 * 获取单项的返回类型
 */
export type GetReturnType<O extends CastOption> = O["splitter"] extends string ? TypeMap[O["type"]][] : TypeMap[O["type"]];

/**
 * 支持的验证类型名称
 */
export type ValidateKeys = keyof typeof validateMap;
export type ValidateValues = { [K in ValidateKeys]: Parameters<typeof validateMap[K]>[0] };
export type ValidateOption = { [K in ValidateKeys]?: ValidateValues[K] };

export interface CastOption {
  /**
   * 目标类型
   * */
  type: TypeKeys;

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

  /**
   * 不允许 null 值
   * @default false
   */
  notNull?: boolean;

  /** 结果验证 */
  validate?: ValidateOption;
};

export class RequiredError extends Error {
  field: string;
  constructor(field: string, message?: string | boolean) {
    super(typeof message === 'string' ? message : `The field '${field || 'unknown'}' is required`);
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
    super(`The field '${field}' value: ${value} must be ${validate} ${target}`);
    this.name = 'ValidateError';
    this.field = field;
    this.value = value;
    this.validate = validate;
    this.target = target;
  }
}

/**
 * 类型转换
 * type 如果为字符串则使用 typeCastMap 中预定义的类型转换。
 * 使用 type[splitter] 表达式将结果转换为指定类型的列表，不指定 splitter 则默认使用英文逗号,
 * @param value 需要被转换的值
 */
export function typeCast<O extends CastOption, T = GetReturnType<O>>(value: any, opt: O, fieldName = 'unknown'): T {
  if (value === null) {
    if (opt.notNull) {
      throw new ValidateError(fieldName, 'notNull', value, opt.type);
    }
    return null;
  }

  if (value === undefined) {
    if (opt.default === undefined) {
      if (opt.required) {
        throw new RequiredError(fieldName, opt.required);
      }
      return;
    }
    value = opt.default;
  }

  if (!(opt.type in typeCastMap)) {
    throw new TypeError('Unknown cast type: ' + opt.type);
  }

  function doCast(value:any) {
    const out = typeCastMap[opt.type](value);
    // 是否转换成功
    if (out === undefined) {
      throw new ValidateError(fieldName, 'cast', value, opt.type);
    }
    // 结果验证
    if (opt.validate) {
      for (const valid of <ValidateKeys[]>Object.keys(opt.validate)) {
        if (!(valid in validateMap)) {
          throw new TypeError(`Unknown validate: ${valid} for ${fieldName}`);
        }
        if (!validateMap[valid](opt.validate[valid])(out)) {
          throw new ValidateError(fieldName, valid, out, opt.validate[valid]);
        }
      }
    }
    return out;
  }

  let out: any;

  if (opt.splitter) {
    let list: any[];
    if (typeof value === 'string') {
      list = value.split(opt.splitter);
    } else if (Array.isArray(value)) {
      list = value;
    } else if (value && value[Symbol.iterator]) {
      list = Array.from(value);
    } else {
      list = [value];
    }

    // 是否限制输入条数
    if (opt.maxItems && value.length > opt.maxItems) {
      throw new ValidateError(fieldName, 'maxItems', value.length, opt.maxItems);
    }
    if (opt.minItems && value.length < opt.minItems) {
      throw new ValidateError(fieldName, 'minItems', value.length, opt.minItems);
    }

    out = list.map(doCast);
  } else {
    out = doCast(value);
  }

  return out;
}

export type TypeCastPickOption = { [field: string]: CastOption | TypeKeys };

/**
 * 挑选输入值并进行类型转换
 */
export function typeCastPick<O extends TypeCastPickOption>(input: any, fieldOpts: O) {
  const out: { [field: string]: any } = {};
  if (typeof input !== "object") {
    input = {};
  }
  for (const fieldName of Object.keys(fieldOpts)) {
    const opt = fieldOpts[fieldName];
    const value = typeCast(input[fieldName], typeof opt === "string" ? { type: opt } : opt , fieldName);
    if (value !== undefined) {
      out[fieldName] = value;
    }
  }
  return out as { [K in keyof O]: O[K] extends CastOption ? GetReturnType<O[K]> : O[K] extends TypeKeys ? TypeMap[O[K]] : never };
}
