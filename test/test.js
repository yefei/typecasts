const assert = require('assert');
const { typeCastPick, RequiredError, ValidateError } = require('..');

const inputData = { a: 1, b: 't', c: 'str  ', d: '1,2,3,4', e: '2021-5-13 13:11:22', f: 'Invalid Date' };

describe('test', function() {
  it('typeCastPick', function() {
    const v = typeCastPick(inputData, [
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

  it('typeCastPickOption', function() {
    const v = typeCastPick(inputData, [
      'a',
      { b: 'bool', c: {
        type: 'string',
        as: 'CCC',
      } },
      { d: 'int[]', e: 'date', f: {
        type: 'date',
        default: '123456',
      } }
    ]);
    assert.deepStrictEqual(v, {
      a: 1,
      b: false,
      CCC: 'str  ',
      d: [ 1, 2, 3, 4 ],
      e: new Date('2021-5-13 13:11:22'),
      f: '123456',
    });
  });

  it('typeCastPickOption(required)', function() {
    assert.throws(() => {
      typeCastPick(inputData, [{
        miss: { required: true },
      }]);
    }, RequiredError);
  });

  it('typeCastPickOption(validate)', function() {
    assert.throws(() => {
      typeCastPick(inputData, [{
        a: { validate: { gt: 100 } }
      }]);
    }, ValidateError);
  });
});
