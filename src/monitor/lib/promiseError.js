export default function recordPromiseError() {
  const { report } = this;

  window.addEventListener("unhandledrejection", function (ev) {
    // ev.preventDefault() // 
    // console.log('promise 错误', ev);
    const payload = {
      type: 'unhandledRejection',
    }
    const { reason } = ev;

    if (typeof reason === 'string') {
      Object.assign(payload, {
        message: reason,
      })
    } else {
      const { message, stack } = reason;
      const matchedResult = stack.match(/:(\d+):(\d+)/) || [];

      Object.assign(payload, {
        message,
        stack,
        position: `${matchedResult[1]}:${matchedResult[2]}`
      })
    }

    report && report(payload) // 实例挂载的 上报方法

    return true;
  }, true);
}
