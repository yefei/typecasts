import { typeCastMap } from './casts';
import { validateMap } from './validates';

/**
 * 支持的类型
 */
export type CastTypes = typeof typeCastMap;

/**
 * 类型 key
 */
export type CastKeys = keyof CastTypes;

/**
 * 类型 key 对应的返回基本类型
 */
export type BasicReturns = { [K in CastKeys]: NonNullable<ReturnType<CastTypes[K]>> };

/**
 * 类型 key 对应的返回默认类型
 */
export type CastReturns = { [K in CastKeys]: BasicReturns[K] | null | undefined };

//////////////////////////////////////////////////

/**
 * 数组类型 key 对应的返回类型
 */
export type ListReturns = { [K in CastKeys as `${K}[]`]: BasicReturns[K][] | null | undefined };

/**
 * 数组类型 key
 */
export type ListKeys = keyof ListReturns;

/**
 * 类型 key + 数组类型 key
 */
export type CastAndListKeys = CastKeys | ListKeys;

/**
 * 类型 key + 数组类型 key 的返回类型
 */
export type CastAndListReturns = CastReturns & ListReturns;

//////////////////////////////////////////////////

/**
 * 允许 undefined
 */
export type UndefinedReturns = { [K in CastKeys as `?${K}`]: BasicReturns[K] | undefined };

/**
 * 允许 undefined
 * 数组模式
 */
export type UndefinedListReturns = { [K in CastKeys as `?${K}[]`]: BasicReturns[K][] | undefined };

//////////////////////////////////////////////////

/**
 * 允许 null
 */
export type NullableReturns = { [K in CastKeys as `~${K}`]: BasicReturns[K] | null };

/**
 * 允许 null
 * 数组模式
 */
export type NullableListReturns = { [K in CastKeys as `~${K}[]`]: BasicReturns[K][] | null };

//////////////////////////////////////////////////

/**
 * 严格模式
 */
export type StrictReturns = { [K in CastKeys as `!${K}`]: BasicReturns[K] };

/**
 * 严格数组模式
 */
export type StrictListReturns = { [K in CastKeys as `!${K}[]`]: BasicReturns[K][] };

//////////////////////////////////////////////////

/**
 * 类型名称对应的类型
 */
export type TypeMap = CastReturns & ListReturns
  & UndefinedReturns & UndefinedListReturns
  & NullableReturns & NullableListReturns
  & StrictReturns & StrictListReturns;

/**
 * 所有支持的转换类型名称
 */
export type TypeKeys = keyof TypeMap;

/**
 * 对象类型
 */
export type ObjectTypes<O extends PickOption> = {
  'object': { [K in keyof O]: GetPickReturnType<O, K> } | undefined | null;
  '!object': { [K in keyof O]: GetPickReturnType<O, K> };
  '~object': { [K in keyof O]: GetPickReturnType<O, K> } | null;
  '?object': { [K in keyof O]: GetPickReturnType<O, K> } | undefined;
  'object[]': { [K in keyof O]: GetPickReturnType<O, K> }[] | undefined | null;
  '!object[]': { [K in keyof O]: GetPickReturnType<O, K> }[];
  '~object[]': { [K in keyof O]: GetPickReturnType<O, K> }[] | null;
  '?object[]': { [K in keyof O]: GetPickReturnType<O, K> }[] | undefined;
}
export type ObjectKeys = keyof ObjectTypes<any>;

/**
 * 数据转换校验选项
 */
export interface CastOption {
  /**
   * 目标类型
   */
  type: TypeKeys | ObjectKeys;

  /** 默认值 */
  default?: any;

  /**
   * 数组切割字符
   * @default ','
   */
  splitter?: string;

  /** 分割数组后最少项目数 */
  minItems?: number;

  /** 分割数组后最大项目数 */
  maxItems?: number;

  /** 结果验证 */
  validate?: ValidateOption;

  /** 在转换之后进行过滤 */
  filter?: (value:any) => boolean;

  /**
   * 来自 input 中的那个键，默认使用 field 键名
   */
  field?: string;

  /**
   * 'object' 类型专用
   * - 如果不设置 object 类型将不会进行类型转换与检查直接返回原始对象
   */
  pick?: PickOption;
}

/**
 * 获取对象返回类型
 */
export type PickOption = { [field: string]: TypeKeys | CastOption };

/**
 * 获取返回类型
 */
export type GetReturnType<O extends CastOption> =
  O['type'] extends ObjectKeys
  ? O['pick'] extends PickOption
    ? ObjectTypes<O['pick']>[O['type']]
    : unknown
  : O['type'] extends TypeKeys
    ? TypeMap[O['type']]
    : never;

/**
 * 获取对象返回类型
 */
export type GetPickReturnType<O extends PickOption, K extends keyof O> = 
  O[K] extends CastOption
  ? (
    O[K]['type'] extends ObjectKeys
    ? O[K]['pick'] extends PickOption
      ? ObjectTypes<O[K]['pick']>[O[K]['type']]
      : unknown
    : O[K]['type'] extends TypeKeys
      ? TypeMap[O[K]['type']]
      : never
  ) : (
    O[K] extends TypeKeys
    ? TypeMap[O[K]]
    : never
  );

/**
 * 支持的验证类型名称
 */
export type ValidateTypes = typeof validateMap;
export type ValidateKeys = keyof ValidateTypes;
export type ValidateValues = { [K in ValidateKeys]: Parameters<ValidateTypes[K]>[0] };
export type ValidateOption = { [K in ValidateKeys]?: ValidateValues[K] };
