# assert-extended
A complimenting library for `require('assert')` with a few more assertions being made available.

# Installation

```
npm install assert-extended --save-dev
```

# Usage

Add the following anywhere in your test:

```
require('assert-extended');
```

And you're good to go.

# Assert

Including the default ones that come with `assert` the following are added:

### assert.notOk(value, message)

Asserts value is a falsy value.

### assert.isFulfilled(promise, message)

Asserts that the promise is fulfilled.

### assert.isRejected(promise, message)

Asserts that the promise is rejected.

### assert.match(value, test, message)

Asserts that the value RexExp matches the test.
