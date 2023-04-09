import { nonemptyTypes, typeCastMap } from './casts';
import { validateMap } from './validates';
import { CastOption, TypeKeys, CastKeys, ValidateKeys, PickOption, GetReturnType, GetPickReturnType } from './types';
import { RequiredError, ValidateError } from './errors';
export * from './types';
export { RequiredError, ValidateError };

/**
 * 类型转换
 * type 如果为字符串则使用 typeCastMap 中预定义的类型转换。
 * 使用 type[splitter] 表达式将结果转换为指定类型的列表，不指定 splitter 则默认使用英文逗号,
 * @param value 需要被转换的值
 */
export function typeCast<O extends CastOption>(value: any, option: O): GetReturnType<O> {
  const opt = Object.assign({}, option) as CastOption;
  if (!opt.type) {
    throw new TypeError('type is required');
  }

  let required = false;
  let nullable = true;
  let toArray = false;
  let type = opt.type;

  // 模式
  switch (type[0]) {
    case '!':
      type = <TypeKeys> type.slice(1);
      required = true;
      nullable = false;
      break;
    case '~':
      type = <TypeKeys> type.slice(1);
      required = true;
      nullable = true;
      break;
    case '?':
      type = <TypeKeys> type.slice(1);
      required = false;
      nullable = false;
      break;
  }

  // 数组模式
  if (type.endsWith('[]')) {
    type = <TypeKeys> type.slice(0, -2);
    toArray = true;
  }

  const fieldName = option.field || 'unknown';

  if (value === null) {
    if (!nullable) {
      throw new ValidateError(fieldName, 'notNull', value, type);
    }
    // @ts-ignore 这里会根据配置选项使用 GetReturnType 决定返回类型
    return null;
  }

  if (value === undefined || (value === '' && nonemptyTypes.includes(type))) {
    if (opt.default === undefined) {
      if (required) {
        throw new RequiredError(fieldName);
      }
      // @ts-ignore 这里会根据配置选项使用 GetReturnType 决定返回类型
      return;
    }
    value = opt.default;
  }

  if (type === 'object') {
    if (!opt.pick) {
      return value;
    }
    return <any> typeCastPick(value, opt.pick);
  }

  if (!(type in typeCastMap)) {
    throw new TypeError(`Unknown cast type: ${type}`);
  }

  function doCast(value:any) {
    const out = typeCastMap[<CastKeys>type](value);
    // 是否转换成功
    if (out === undefined) {
      if (!required) return;
      throw new ValidateError(fieldName, 'cast', value, type);
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
    // 使用自定义过滤器
    if (opt.filter && !opt.filter(out)) {
      return;
    }
    return out;
  }

  let out: any;

  if (toArray) {
    let list: any[];
    if (typeof value === 'string') {
      list = value.split(opt.splitter || ',');
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

    out = list.map(doCast).filter(i => i !== undefined);
  } else {
    out = doCast(value);
  }

  return out;
}

/**
 * 挑选输入值并进行类型转换
 */
export function typeCastPick<O extends PickOption>(input: any, fieldOpts: O) {
  const out: { [field: string]: any } = {};
  if (typeof input !== "object") {
    input = {};
  }
  for (const [fieldName, o] of Object.entries(fieldOpts)) {
    const opt = typeof o === "string" ? { type: o } : o;
    if (!opt.field) {
      opt.field = fieldName;
    }
    const value = typeCast(input[opt.field], opt);
    if (value !== undefined) {
      out[fieldName] = value;
    }
  }
  return out as {
    [K in keyof O]: GetPickReturnType<O, K>
  };
}

/*
const k = typeCast(null, {
  type: '!object',
  pick: {
    bb: '!bool',
  }
});

const a = typeCastPick({}, {
  aaa: '!int',
  bbb: {
    type: '!bool',
  },
  obj: {
    type: '~object[]',
    pick: {
      ob1: 'int',
      ob2: 'bool',
    }
  }
});
*/
