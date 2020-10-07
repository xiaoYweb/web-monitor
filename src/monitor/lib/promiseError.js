import webtrack from '../utils/webtrack';

export default function recordPromiseError() {
  window.addEventListener("unhandledrejection", function (ev) {
    // ev.preventDefault() // 
    console.log('promise 错误', ev);
    const payload = {
      errorType: 'unhandled rejection',
      errorTypeNo: '3',
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


    webtrack.report(payload)
    return true;
  }, true);
}
