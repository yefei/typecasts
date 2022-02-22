# typecasts

类型转换并验证转换结果是否满足条件，完美支持 TypeScript 类型输出

```ts
const inputData = {
  a: 1,
  b: 't',
  c: 'str  ',
  d: '1,2,3,4',
  e: '2021-5-13 13:11:22',
  f: 'Invalid Date',
  url: 'http://test',
  big: 111122223333444455556666777788889999n,
};

const v = typeCastPick(inputData, {
  b: 'bool',
  c: 'trim',
  d: { type: 'int', splitter: ',', minItems: 1 },
  e: 'date',
  f2: 'date',
  big: 'string',
});

console.log(v);
/*
{
  a: 1,
  b: false,
  c: 'str',
  d: [ 1, 2, 3, 4 ],
  e: new Date('2021-5-13 13:11:22'),
  big: '111122223333444455556666777788889999',
}
*/
```
