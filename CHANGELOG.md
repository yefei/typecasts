# Changelog

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
