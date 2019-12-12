import chalk from 'chalk';

const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

class Fromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = null;
    this.queue = [];
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  resolve = value => {
    if (this.state !== PENDING) return;
    this.state = RESOLVED;
    this.value = value;

    try {
      this.queue.forEach(({ onResolved, onRejected }) => {
        if (this.state === RESOLVED) {
          this.value = onResolved(this.value);
        }
        if (this.state === REJECTED) {
          this.value = onRejected(this.value);
        }
      });
    } catch (error) {
      this.queue = [];
      this.reject(error);
    }
  };

  reject = error => {
    if (this.state !== PENDING) return;

    this.state = REJECTED;
    this.value = error;

    this.queue.forEach(({ onResolved, onRejected }) => {
      this.then(onResolved, onRejected);
    });
  };

  then = (onResolved, onRejected) => {
    if (this.state === RESOLVED) {
      onResolved(this.value);
    }
    if (this.state === REJECTED) {
      onRejected(this.value);
    }
    if (this.state === PENDING) {
      this.queue.push({ onResolved, onRejected });
    }
    return new Fromise();
  };
}

describe('Fromise Tests Init', () => {
  it('receives an executor function when constructed which is called immediately', () => {
    const executor = jest.fn();
    const promise = new Fromise(executor);

    // mock function should be called immediately
    expect(executor.mock.calls.length).toBe(1);
    // arguments should be functions
    expect(typeof executor.mock.calls[0][0]).toBe('function');
    expect(typeof executor.mock.calls[0][1]).toBe('function');
  });

  it('is in a pending state', () => {
    const promise = new Fromise(jest.fn());

    expect(promise.state).toBe(PENDING);
  });

  it('transitions to the resolved state with a value', () => {
    const value = 'cece';
    const promise = new Fromise((res, rej) => {
      res(value);
    });

    expect(promise.state).toBe(RESOLVED);
  });

  it('transitions to the rejected state with an error', () => {
    const error = new Error('not today brah!!!');
    const promise = new Fromise((res, rej) => {
      rej(error);
    });

    expect(promise.state).toBe(REJECTED);
  });

  it('should have a .then method', () => {
    const promise = new Fromise(jest.fn());

    expect(typeof promise.then).toBe('function');
  });

  it('should call the onResolved method when a promise is in a resolved state', () => {
    const onResolved = jest.fn();
    const val = 23;
    const promise = new Fromise((res, rej) => {
      res(val);
    }).then(onResolved);

    expect(onResolved.mock.calls.length).toBe(1);
    expect(onResolved.mock.calls[0][0]).toBe(23);
  });

  it('should call the onRejected method when a promise is in a rejected state', () => {
    const onRejected = jest.fn();
    const err = 'wtf bro!';
    const promise = new Fromise((res, rej) => {
      rej(err);
    }).then(null, onRejected);

    expect(onRejected.mock.calls.length).toBe(1);
    expect(onRejected.mock.calls[0][0]).toBe('wtf bro!');
  });

  it('when a promise is resolved it should not be rejected with another value', () => {
    const onRejected = jest.fn();
    const onResolved = jest.fn();
    const val = 23;
    const err = 'wtf bro!';

    const promise = new Fromise((res, rej) => {
      res(val);
      rej(err);
    });
    promise.then(onResolved, onRejected);

    expect(onResolved.mock.calls.length).toBe(1);
    expect(onResolved.mock.calls[0][0]).toBe(23);
    expect(onRejected.mock.calls.length).toBe(0);
    expect(promise.state).toBe(RESOLVED);
  });

  it('when a promise is rejected it should not be resolved with another value', () => {
    const onRejected = jest.fn();
    const onResolved = jest.fn();
    const val = 23;
    const err = 'wtf bro!';

    const promise = new Fromise((res, rej) => {
      rej(err);
      res(val);
    });

    promise.then(onResolved, onRejected);

    expect(promise.state).toBe(REJECTED);
    expect(onResolved.mock.calls.length).toBe(0);
    expect(onRejected.mock.calls[0][0]).toBe('wtf bro!');
    expect(onRejected.mock.calls.length).toBe(1);
  });

  it('when the executor fails the promise should transition to the REJECTED state', () => {
    const onRejected = jest.fn();
    const error = new Error('fuck u!');
    const promise = new Fromise((res, rej) => {
      throw error;
    });

    promise.then(null, onRejected);

    expect(promise.state).toBe(REJECTED);
    expect(onRejected.mock.calls[0][0]).toBe(error);
    expect(onRejected.mock.calls.length).toBe(1);
  });

  it('should queue callbacks when the promise is not resolved immediately', done => {
    const value = 23;
    const onResolved = jest.fn();

    const promise = new Fromise((res, rej) => {
      setTimeout(() => res(value), 1000);
    });

    promise.then(onResolved);

    setTimeout(() => {
      // should have been called twice
      expect(onResolved.mock.calls.length).toBe(1);
      console.log('öeyeyafsadf', onResolved.mock.calls);
      expect(onResolved.mock.calls[1][0]).toBe(value);
      done();
    }, 2000);

    // should not be called immediately
    expect(onResolved.mock.calls.length).toBe(0);

    setTimeout(function() {
      // should have been called twice
      expect(onResolved.mock.calls.length).toBe(2);
      expect(onResolved.mock.calls[1][0]).toBe(value);
      done();
    }, 4000);
  });

  it('should queue callbacks when the promise is not rejected immediately', done => {
    const error = 'Fuck!';
    const promise = new Fromise((res, rej) => {
      setTimeout(() => rej(error), 1);
    });

    const onRejected = jest.fn();

    promise.then(null, onRejected);

    setTimeout(() => {
      // should have been called once
      expect(onRejected.mock.calls.length).toBe(1);
      expect(onRejected.mock.calls[0][0]).toBe(reason);
      promise.then(null, onRejected);

      done();
    }, 5);

    // should not be called immediately
    expect(onRejected.mock.calls.length).toBe(0);

    setTimeout(() => {
      // should have been called twice
      expect(onRejected.mock.calls.length).toBe(2);
      expect(onRejected.mock.calls[1][0]).toBe(reason);
      done();
    }, 10);
  });
});
