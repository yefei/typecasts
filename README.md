# typecasts

类型转换并验证转换结果是否满足条件，并且支持 TypeScript 类型输出

## 使用样例

```ts
import { typeCast } from "typecasts";

const var1 = typeCast("123", { type: "int" });

console.log(var1); // 123
console.log(typeof var1); // number
```

使用 typeCastPick 挑选对象中的多个数据

```ts
import { typeCastPick } from "typecasts";

// 输入数据
const inputData = {
  a: 1,
  b: 'yes',
  c: 'str  ',
  d: '1,2,3,4',
  e: '2021-5-13 13:11:22',
  f: 'http://test',
};

// 类型处理
const v = typeCastPick(inputData, {
  a: '!int',  // 整数类型，! 感叹号开头表示此项必须并且不能为null
  b: 'bool',
  c: 'trim',
  d: 'int[]', // 如果以 [] 结尾则代表转换为类型数组形式
  e: 'date',
  f: {
    // 如果不使用快捷类型，可以分别指定类型的转换规则
    type: 'trim',         // 目标类型
    default: 'not-url',   // 默认值
    splitter: ',',        // 是否切割为数组，定义切割字符
    minItems: 1,          // 切割数组后最少需要的元素数量
    maxItems: 10,         // 切割数组后最多不能超过的元素数量
    required: false,      // 是否为必须
    notNull: false,       // 是否允许 null 值
    // 数据验证规则
    validate: {
      url: true, // 验证是否符合链接格式
    },
  }
});

console.log(v);

// 输出
{
  a: 1,
  b: true,
  c: 'str',
  d: [ 1, 2, 3, 4 ],
  e: new Date('2021-5-13 13:11:22'),
  f: 'http://test',
}
```

## 类型规则快捷方式

例如 `int` 类型名称，可以写成 `!int`  或者  `int[]` 或两者的组合  `!int[]`

```js
// !int 感叹号开头等于如下配置
{
  type: 'int',
  required: true,
  notNull: true,
}

// [] 结尾等于如下配置
{
  type: 'int',
  splitter: ',',
}

// 两者结合 !int[]
{
  type: 'int',
  required: true,
  notNull: true,
  splitter: ',',
}
```

## 支持的转换类型
| 类型名称 | 目标类型 ｜ 功能描述 |
| ------- | ------- | ------- |
| number  | `number`  | 任何数值类型，整数、浮点 |
| int  | `number`  | 转换为整数类型 |
| float  | `number`  | 转换为浮点数类型 |
| bool  | `boolean`  | 转换为布尔类型，只有值为 y, 1, yes, on, true (不区分类型)才会被判定为 true，其他都为 false |
| trim  | `string`  | 转换为字符串并去除两端的空字符 |
| string  | `string`  | 转换为字符串 |
| any  | `any` | 不进行类型转换，直接输出原始类型 |
| date  | `Date`  | 转换为日期类型 |

## 支持的数据验证
| 验证器名称 | 功能描述 | 参数 ｜
| ------- | ------- | ------- |
| lt | 小于 < | `any` |
| lte | 小于等于 <= | `any` |
| gt | 大于 > | `any` |
| gte | 大于等于 >= | `any` |
| eq | 等于 == | `any` |
| neq | 不等于 != | `any` |
| maxLength | 最大长度，调用值的 .length 属性 | `number` |
| minLength | 最小长度，调用值的 .length 属性 | `number` |
| in | 只能出现的值 | `any[]` |
| notIn | 不能出现的值 | `any[]` |
| regexp | 正则表达式匹配 | `string | RegExp` |
| email | 是否满足Email地址规则 | `boolean` |
| slug | 是否满足URL路径规则 | `boolean` |
| url | 是否满足 URL 规则 | `string[] | boolean` |
