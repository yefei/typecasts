import { typeCastPick } from "../src";

// typeCastPick({ a: 1 }, {
//   a: { type: 'origin', validate: { gt: 100 } }
// });

typeCastPick({ f: 'asasas' }, {
  f: {
    type: 'date',
    required: true,
  }
});
