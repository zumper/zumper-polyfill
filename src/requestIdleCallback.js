// https://gist.github.com/paullewis/55efe5d6f05434a96c36
global.requestIdleCallback =
  global.requestIdleCallback ||
  ((cb) =>
    setTimeout(() => {
      const start = Date.now()
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      })
    }, 1))

global.cancelIdleCallback =
  global.cancelIdleCallback ||
  ((id) => {
    clearTimeout(id)
  })
