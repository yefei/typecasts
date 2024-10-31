# Changelog

## [3.2.1] - 2024-10-31
- fix: date 为 1970-1-1 日时判断错误

## [3.2.0] - 2023-5-19
- 如果允许为 null, nonemptyTypes 中空字符串则转换为 null 类型

## [3.1.2] - 2023-5-17
- fix: bool 类型空字符返回 undefined

## [3.1.1] - 2023-4-26
- fix: object[] 对象数组解析

## [3.1.0] - 2023-4-21
- 更新: 导出更多类型

## [3.0.5] - 2023-4-9
- fix: 数组数量判断取错变量

## [3.0.4] - 2023-4-9
- fix: !isFinite
- 增加非空字符串类型判定

## [3.0.3] - 2023-4-9
- int float 判断 isFinite, 如果传入值为 '' 则返回 0

## [3.0.2] - 2023-4-7
- fix: bool 类型判断 `true` 为 `false` 

## [3.0.1] - 2023-4-7
- trim2 -> trim1 并改进潜在 bug
- 整理代码

## [3.0.0] - 2023-4-1
- 移除 type: PickOption 功能，改用 'object' 类型并使用 `CastOption.pick: PickOption` 替代

## [2.8.0] - 2023-3-31
- 重写大部分类型定义
- 移除 required, notNull 选项，改为 ?type, ~type
- splitter 参数不再作为数组类型开关，需要使用 type[]

## [2.7.2] - 2023-3-28
- 数组类型 null | undefined 标示位置错误

## [2.7.1] - 2023-3-28
- missing: d.ts

## [2.7.0] - 2023-3-28
- 非严格模式返回类型添加 null | undefined
- type 支持嵌套 TypeCastPickOption 对象
