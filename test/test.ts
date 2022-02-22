const assert = require('assert');
const { typeCastPick, RequiredError, ValidateError } = require('..');

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

describe('test', function() {
  it('typeCastPick', function() {
    const v = typeCastPick(inputData, [
      'a',
      { b: 'bool', c: 'trim' },
      { d: { type: 'int[]', minItems: 1 }, e: 'date', f2: 'date' },
      { big: 'string' },
    ]);
    assert.deepStrictEqual(v, {
      a: 1,
      b: false,
      c: 'str',
      d: [ 1, 2, 3, 4 ],
      e: new Date('2021-5-13 13:11:22'),
      big: '111122223333444455556666777788889999',
    });
  });

  it('typeCastPickOption', function() {
    const v = typeCastPick(inputData, [
      'a',
      { b: 'bool', c: {
        type: 'string',
        as: 'CCC',
      } },
      { d: 'int[]', e: 'date', f2: {
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
      f2: '123456',
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
    assert.throws(() => {
      typeCastPick(inputData, [{
        f: {
          type: 'date',
          required: true,
        }
      }]);
    }, ValidateError);
  });

  it('typeCastPickOption(validate.url)', function() {
    typeCastPick(inputData, [{
      url: { validate: { url: true } }
    }]);
    typeCastPick(inputData, [{
      url: { validate: { url: ['http'] } }
    }]);
    assert.throws(() => {
      typeCastPick(inputData, [{
        url: { validate: { url: false } }
      }]);
    }, ValidateError);
    assert.throws(() => {
      typeCastPick(inputData, [{
        url: { validate: { url: ['ftp'] } }
      }]);
    }, ValidateError);
    typeCastPick(inputData, [{
      url: { type: 'trim[]', validate: { url: true } }
    }]);
  });
});
