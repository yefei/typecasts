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
  trims: ',2,3,,5,',
  h: null,
  url: 'http://test',
  big: 111122223333444455556666777788889999n,
  obj: {
    aa: 1,
    bb: 'bb',
  }
};

describe('test', function() {
  it('typeCastPick', function() {
    const v = typeCastPick(inputData, {
      a: 'any',
      b: 'bool',
      c: 'trim',
      d: { type: 'int[]', minItems: 1 },
      e: 'date',
      f2: 'date',
      big: 'string',
    });
    assert.deepStrictEqual(v, {
      a: 1,
      b: true,
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
        h: { type: '?string' },
      });
    }, ValidateError);
  });

  it('typeCastPickOption(required)', function() {
    assert.throws(() => {
      typeCastPick(inputData, {
        miss: { type: '!any' },
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
          type: '!date',
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
      url: { type: 'trim[]', splitter: '|', validate: { url: true } }
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
    assert.deepStrictEqual(v, undefined);
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
      trims: {
        type: 'trim[]',
        filter: v => v != '',
      },
    });
    assert.deepStrictEqual(v, { d: ['1','2','3','4'], g: [''], trims: ['2','3','5'] });
  });

  it("trim1[]", function(){
    const v = typeCastPick(inputData, {
      d: 'trim1[]',
      g: 'trim1[]',
      trims: 'trim1[]',
    });
    assert.deepStrictEqual(v, { d: ['1','2','3','4'], g: [], trims: ['2','3','5'] });
  });

  it("object", function(){
    const v = typeCastPick(inputData, {
      a: '!int',
      b: '!trim',
      obj: {
        type: '!object',
        pick: {
          aa: '!number',
          bb: {
            type: '!string',
          }
        },
      },
    });
    assert.deepStrictEqual(v, {
      a: 1,
      b: 't',
      obj: {
        aa: 1,
        bb: 'bb',
      }
    });
  });

  it("bool=true", function(){
    const v = typeCastPick({ t: true }, {
      t: '!bool',
    });
    assert.deepStrictEqual(v, { t: true });
  });

  it("object[]", function(){
    const v = typeCastPick({ arr: [
      { id: 1 },
    ] }, {
      arr: {
        type: '!object[]',
        pick: {
          id: '!int',
        }
      }
    });
    assert.deepStrictEqual(v, { arr: [ { id: 1 } ] });
  });
});
