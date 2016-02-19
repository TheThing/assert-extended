const assert = require('assert');
const util = require('util');
const assertExtended = require('../lib/assert');

describe('assert', () => {
  const testLongObject = {
    a: 1, b:2, c:3, d:4,
    e: {herp: 51, derp: 23},
    f: 'asdfgagwegawegawegawegawe',
    g: '32ghaiwugb23 238023'
  };

  it('assertExtended should be identical to extended', () => {
    assert.strictEqual(assertExtended, assert);
  });

  describe('#notOk()', () => {
    it('should exist', () => {
      assert.ok(assert.notOk);
    });

    it('should throw for true values', () => {
      assert.throws(() => {
        assert.notOk(true);
      }, assert.AssertionError);
    });

    it('should pass for false values', () => {
      assert.notOk(false);
    });
  });

  describe('#isFulfilled()', () => {
    it('should exist', () => {
      assert.ok(assert.isFulfilled);
    });

    it('should throw for rejected promises', () => {
      return assert.isFulfilled(Promise.reject({}))
        .catch((err) => {
          assert.ok(err.message.match(/promise fail/));
        });
    });

    it('should properly parse rejected object response', () => {
      let assertMessage = util.inspect(testLongObject, {depth: 1}).replace(/\n /g, '');
      assertMessage = assertMessage.slice(0, 64) + '...';

      return assert.isFulfilled(Promise.reject(testLongObject))
        .catch((err) => 
          assert.notStrictEqual(err.message.indexOf(assertMessage), -1)
        );
    });

    it('should include error message if error', () => {
      const assertMessage = 'something something dark side';
      return assert.isFulfilled(Promise.reject(new Error(assertMessage)))
        .catch((err) => {
          assert.ok(err.message.match(new RegExp('with ' + assertMessage)));
        });
    });

    it('should pass for resolved promises', () => {
      return assert.isFulfilled(Promise.resolve());
    });

    it('should support custom message', () => {
      const assertMessage = 'something something dark side';
      return assert.isFulfilled(Promise.reject({}), assertMessage)
        .catch((err) => assert.ok(err.message.match(assertMessage)));
    })

    it('should return result for the resolved promise', () => {
      const assertResult = {a: 1}

      return assert.isFulfilled(Promise.resolve(assertResult))
        .then((data) => assert.strictEqual(data, assertResult));
    });
  });

  describe('#isRejected()', () => {
    it('should exist', () => {
      assert.ok(assert.isRejected);
    });

    it('should throw for resolved promises', () => {
      let hasFailed = false;

      return assert.isRejected(Promise.resolve({}))
        .catch((err) => {
          hasFailed = true;
          assert.ok(err.message.match(/fulfilled with/));
        })
        .then(() => {
          assert.strictEqual(hasFailed, true);
        });
    });

    it('should properly stringify objects', () => {
      let assertMessage = util.inspect(testLongObject, {depth: 1}).replace(/\n /g, '');
      assertMessage = assertMessage.slice(0, 64) + '...';

      return assert.isRejected(Promise.resolve(testLongObject))
        .catch((err) =>
          assert.notStrictEqual(err.message.indexOf(assertMessage), -1)
        );
    });

    it('should support custom message', () => {
      const assertMessage = 'something something dark side';
      return assert.isRejected(Promise.resolve({}), assertMessage)
        .catch((err) => assert.ok(err.message.match(assertMessage)));
    })

    it('should return result for the unresolved promise', () => {
      const assertResult = {a: 1}

      return assert.isRejected(Promise.reject(assertResult))
        .then((data) => assert.strictEqual(data, assertResult));
    });
  });

  describe('#match()', () => {
    it('should exist', () => {
      assert.ok(assert.match);
    });

    it('should throw if no match', () => {
      assert.throws(() => {
        assert.match('a', /b/);
      }, assert.AssertionError);
    });

    it('should pass if matches', () => {
      assert.match('a', /a/);
    });
  });
});
