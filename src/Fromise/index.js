const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'

export default class Fromise {
  constructor(executor) {
    this.state = PENDING
    this.value = null
    this.queue = []
    try {
      executor(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }

  resolve = value => {
    if (this.state !== PENDING) return
    this.state = RESOLVED
    this.value = value

    try {
      this.queue.forEach(({ onResolved, onRejected }) => {
        if (this.state === RESOLVED) {
          onResolved(this.value)
        }
        if (this.state === REJECTED) {
          onRejected(this.value)
        }
      })
    } catch (error) {
      this.queue = []
      this.reject(error)
    }
  }

  reject = error => {
    if (this.state !== PENDING) return

    this.state = REJECTED
    this.value = error

    try {
      this.queue.forEach(({ onResolved, onRejected }) => {
        if (this.state === RESOLVED) {
          onResolved(this.value)
        }
        if (this.state === REJECTED) {
          onRejected(this.value)
        }
      })
    } catch (err) {
      this.queue = []
      this.reject(err)
    }
  }

  then = (onResolved, onRejected) => {
    const newPromise = new Fromise(() => {})

    if (this.state === RESOLVED) {
      try {
        this.value = onResolved(this.value)
        newPromise.resolve(this.value)
      } catch (err) {
        newPromise.reject(err)
      }
    }
    if (this.state === REJECTED) {
      try {
        this.value = onRejected(this.value)
        newPromise.resolve(this.value)
      } catch (err) {
        newPromise.reject(err)
      }
    }
    if (this.state === PENDING) {
      this.queue.push({ onResolved, onRejected, newPromise })
    }
    return newPromise
  }
}
