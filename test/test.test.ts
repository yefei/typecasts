import * as assert from 'assert';
import { typeCastPick, RequiredError, ValidateError, typeCast } from '../src';

const inputData = {
  a: 1,
  b: 't',
  c: 'str  ',
  d: '1,2,3,4',
  e: '2021-5-13 13:11:22',
  f: 'Invalid Date',
  g: '',
  trims: ',',
  h: null,
  url: 'http://test',
  big: 111122223333444455556666777788889999n,
};

describe('test', function() {
  it('typeCastPick', function() {
    const v = typeCastPick(inputData, {
      a: 'any',
      b: 'bool',
      c: 'trim',
      d: { type: 'int', splitter: ',', minItems: 1 },
      e: 'date',
      f2: 'date',
      big: 'string',
    });
    assert.deepStrictEqual(v, {
      a: 1,
      b: false,
      c: 'str',
      d: [ 1, 2, 3, 4 ],
      e: new Date('2021-5-13 13:11:22'),
      big: '111122223333444455556666777788889999',
    });
  });

  it('typeCastPick(empty string)', function() {
    assert.deepStrictEqual(typeCastPick(inputData, {
      g: 'trim',
    }), {
      g: '',
    });
    assert.deepStrictEqual(typeCastPick(inputData, {
      g: 'string',
    }), {
      g: '',
    });
  });

  it('nullable', function() {
    assert.deepStrictEqual(typeCastPick(inputData, {
      h: 'string',
    }), {
      h: null,
    });
    assert.throws(() => {
      typeCastPick(inputData, {
        h: { type: 'string', notNull: true },
      });
    }, ValidateError);
  });

  it('typeCastPickOption(required)', function() {
    assert.throws(() => {
      typeCastPick(inputData, {
        miss: { type: 'any', required: true },
      });
    }, RequiredError);
  });

  it('typeCastPickOption(validate)', function() {
    assert.throws(() => {
      typeCastPick(inputData, {
        a: { type: 'any', validate: { gt: 100 } }
      });
    }, ValidateError);
    assert.throws(() => {
      typeCastPick(inputData, {
        f: {
          type: 'date',
          required: true,
        }
      });
    }, ValidateError);
  });

  it('typeCastPickOption(validate.url)', function() {
    typeCastPick(inputData, {
      url: { type: 'trim', validate: { url: true } }
    });
    typeCastPick(inputData, {
      url: { type: 'trim', validate: { url: ['http'] } }
    });
    assert.throws(() => {
      typeCastPick(inputData, {
        url: { type: 'trim', validate: { url: false } }
      });
    }, ValidateError);
    assert.throws(() => {
      typeCastPick(inputData, {
        url: { type: 'trim', validate: { url: ['ftp'] } }
      });
    }, ValidateError);
    typeCastPick(inputData, {
      url: { type: 'trim', splitter: '|', validate: { url: true } }
    });
  });

  it("Strict", function(){
    const v = typeCastPick(inputData, {
      a: '!int',
    });
    assert.deepStrictEqual(v, { a: 1 });
  });
  it("Strict ValidateError", function(){
    assert.throws(() => {
      typeCastPick(inputData, {
        b: '!int',
      });
    }, ValidateError);
  });

  it("Array", function(){
    const v = typeCastPick(inputData, {
      d: 'int[]',
    });
    assert.deepStrictEqual(v, { d: [1,2,3,4] });
  });

  it("StrictArray", function(){
    const v = typeCastPick(inputData, {
      d: '!int[]',
    });
    assert.deepStrictEqual(v, { d: [1,2,3,4] });
  });
  it("StrictArray ValidateError", function(){
    assert.throws(() => {
      typeCastPick(inputData, {
        b: '!int[]',
      });
    }, ValidateError);
  });

  it("[undefined filter]", function(){
    const v = typeCast('', { type: 'int[]' });
    assert.deepStrictEqual(v, []);
  });

  it("pick field", function(){
    const v = typeCastPick(inputData, {
      d: {
        type: 'int',
        field: 'a',
      },
    });
    assert.deepStrictEqual(v, { d: 1 });
  });

  it("trim[]", function(){
    const v = typeCastPick(inputData, {
      d: 'trim[]',
      g: 'trim[]',
      trims: 'trim[]',
    });
    assert.deepStrictEqual(v, { d: ['1','2','3','4'], g: [''], trims: ['',''] });
  });
});
