const assert = require('assert');
const { typeCastPick } = require('..');

describe('test', function() {
  it('typeCastPick', function() {
    const v = typeCastPick({ a: 1, b: 't', c: 'str  ', d: '1,2,3,4', e: '2021-5-13 13:11:22', f: 'Invalid Date' }, [
      'a',
      { b: 'bool', c: 'trim' },
      { d: 'int[]', e: 'date', f: 'date' }
    ]);
    assert.deepStrictEqual(v, {
      a: 1,
      b: false,
      c: 'str',
      d: [ 1, 2, 3, 4 ],
      e: new Date('2021-5-13 13:11:22'),
    });
  });
});
