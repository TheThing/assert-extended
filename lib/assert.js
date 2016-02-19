const assert = require('assert');
const util = require('util');
const fail = assert.fail;

function truncate(s, n) {
  return s.length < n ? s : s.slice(0, n) + '...';
}

function stringifyObject(data) {
  if (typeof(data) !== 'string') {
    data = util.inspect(
        data,
        { depth: 1 }
      )
      .replace(/\n /g, '');
  }
  return truncate(data, 64);
}

assert.notOk = (value, message) => {
  if (value) {
    fail(value, false, message, '==', assert.notOk)
  }
}

assert.match = (value, test, message) => {
  let result = value.match(test);
  if (result) return;

  fail(value, test, message, 'match', assert.match);
}

assert.isFulfilled = (promise, message) => {
  return Promise.resolve(true)
    .then(() => promise)
    .catch((err) => {
      if (!message) {
        message = `promise failed with ${err.message || stringifyObject(err)}`;
      }
      fail(err, null, message, '', assert.isFulfilled);
    });
}

assert.isRejected = (promise, message) => {
  let hasFailed = false;

  return Promise.resolve(true)
    .then(() => promise)
    .catch((data) => {
      hasFailed = true;
      return data;
    })
    .then((data) => {
      if (hasFailed) return data;
      if (!message) {
        message = `promise was fulfilled with ${stringifyObject(data)}`;
      }

      fail(data, null, message, '', assert.isRejected);
    });
}

module.exports = assert;
