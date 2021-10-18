
// 内置支持转换类型
export type castType = 'number' | 'int' | 'float' | 'bool' | 'trim' | 'date' | 'string' | 'origin';

// 自定义转换函数
export type castTypeFunc = (value: any) => any;

export type castTypeOption = {
  /** 目标类型 */
  type: castType | castTypeFunc;

  /** 别名 */
  as?: string;

  /** 默认值 */
  default?: any;

  /** 分割为数组 */
  splitter?: string;
};

// 转换字段
export type castFields = (
  string |
  { [inputKey: string]: castType | castTypeFunc | castTypeOption }
);

export declare function typeCast(value: any, type: castType | castTypeFunc, splitter?: string): any;

export declare function typeCastPick(input: { [key: string]: any }, fields: castFields[]): { [as: string]: any };
