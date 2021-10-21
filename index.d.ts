
// 内置支持转换类型
export type castType = 'number' | 'int' | 'float' | 'bool' | 'trim' | 'date' | 'string' | 'origin';

// 自定义转换函数
export type castTypeFunc = (value: any) => any;

export type validates = {
  /** 小于 */
  lt?: number;

  /** 大于 */
  gt?: number;

  /** 等于 */
  eq?: any;

  /** 不等于 */
  neq?: any;

  /** 最大长度 */
  maxLength?: number;

  /** 最小长度 */
  minLength?: number;

  /** 必须在指定值内 */
  in?: any[];

  /** 不能在指定值内 */
  notIn?: any[];

  /** 正则匹配 */
  regexp?: string;

  /** 必须为email格式 */
  email?: boolean;

  /** 符合标准url slug */
  slug?: boolean;
}

export type castTypeOption = {
  /** 目标类型, 默认: origin */
  type?: castType | castTypeFunc;

  /** 别名 */
  as?: string;

  /** 默认值 */
  default?: any;

  /** 分割为数组 */
  splitter?: string;

  /** 是否为必须项 */
  required?: boolean | string;

  /** 结果验证 */
  validate?: validates;
};

// 转换字段
export type castFields = (
  string |
  { [inputKey: string]: castType | castTypeFunc | castTypeOption }
);

export declare function typeCast(value: any, type: castType | castTypeFunc, splitter?: string): any;

export declare function typeCastAs(value: any, type: castType | castTypeFunc | castTypeOption, key: string): [ as: string, value: any ];

export declare function typeCastPick(input: { [key: string]: any }, fields: castFields[]): { [as: string]: any };

export declare class RequiredError extends Error {
  filed: string;
};

export declare class ValidateError extends Error {
  field: string;
  value: any;
  validate: string;
  target: any;
};
