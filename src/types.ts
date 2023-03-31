import typeCastMap from './casts';
import validateMap from './validates';

/**
 * 支持的类型
 */
type CastTypes = typeof typeCastMap;
export type CastKeys = keyof CastTypes;
type CastReturns = { [K in CastKeys]: ReturnType<CastTypes[K]> | undefined | null };
type CastBasics = { [K in CastKeys]: Exclude<ReturnType<CastTypes[K]>, undefined> };

/**
 * 数组模式
 */
type ArrayReturns = { [K in CastKeys as `${K}[]`]: CastBasics[K][] | null | undefined };

//////////////////////////////////////////////////

/**
 * 允许 undefined
 */
type UndefinedReturns = { [K in CastKeys as `?${K}`]: CastBasics[K] | undefined };

/**
 * 允许 undefined
 * 数组模式
 */
type UndefinedArrayReturns = { [K in CastKeys as `?${K}[]`]: CastBasics[K][] | undefined };

//////////////////////////////////////////////////

/**
 * 允许 null
 */
type NullableReturns = { [K in CastKeys as `~${K}`]: Exclude<CastReturns[K], undefined> };

/**
 * 允许 null
 * 数组模式
 */
type NullableArrayReturns = { [K in CastKeys as `~${K}[]`]: CastBasics[K][] | null };

//////////////////////////////////////////////////

/**
 * 严格模式
 */
type StrictReturns = { [K in CastKeys as `!${K}`]: CastBasics[K] };

/**
 * 严格数组模式
 */
type StrictArrayReturns = { [K in CastKeys as `!${K}[]`]: CastBasics[K][] };

//////////////////////////////////////////////////

/**
 * 类型名称对应的类型
 */
export type TypeMap = CastReturns & ArrayReturns
  & UndefinedReturns & UndefinedArrayReturns
  & NullableReturns & NullableArrayReturns
  & StrictReturns & StrictArrayReturns;

/**
 * 所有支持的转换类型名称
 */
export type TypeKeys = keyof TypeMap;

/**
 * 数据转换校验选项
 */
export interface CastOption {
  /**
   * 目标类型
   */
  type: TypeKeys | PickOption;

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
}

/**
 * 获取对象返回类型
 */
export type PickOption = { [field: string]: TypeKeys | CastOption };

/**
 * 获取返回类型
 */
export type GetReturnType<O extends CastOption> = (
  O['type'] extends TypeKeys ? TypeMap[O['type']] :
  O['type'] extends PickOption ? GetPickReturnType<O['type']> : never);

/**
 * 获取对象返回类型
 */
export type GetPickReturnType<O extends PickOption> = {
  [K in keyof O]: (
    O[K] extends CastOption
    ? (
      O[K]['type'] extends TypeKeys
      ? TypeMap[O[K]['type']]
      : O[K]['type'] extends PickOption
      ? GetPickReturnType<O[K]['type']>
      : never
    ) : (
      O[K] extends TypeKeys
      ? TypeMap[O[K]]
      : never
    )
  )
};

/**
 * 支持的验证类型名称
 */
export type ValidateTypes = typeof validateMap;
export type ValidateKeys = keyof ValidateTypes;
export type ValidateValues = { [K in ValidateKeys]: Parameters<ValidateTypes[K]>[0] };
export type ValidateOption = { [K in ValidateKeys]?: ValidateValues[K] };
