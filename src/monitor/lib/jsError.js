import { handleBantchReport } from '../utils';

const sourceCache = []
const cache = [];

export default function recordJsError() {
  const { report, onoceReport } = this;
  
  window.addEventListener('error', function (ev) {
   const { target } = ev;

    // 资源加载错误
    if (target && (target.href || target.src)) {
      // console.log("资源加载 错误", target, ev)
      const { nodeName } = target;
      const payload = {
        errorType: '资源加载错误', // resource error
        errorTypeNo: '2',
        nodeName,
        source: target.href || target.src,
      }
      report && report(payload)
      return
    }

    // console.log("js 脚本错误", ev, target)
    // js 脚本错误
    const { lineno, colno, message } = ev;

    const payload = {
      errorType: 'jsError',
      errorTypeNo: '1',
      message,
      ln: lineno,
      col: colno,
      position: `${lineno}:${colno}`,
      stack: ev?.error?.stack,
    }
    handleBantchReport({
      report, cache, payload,
      maxLength: onoceReport?.jsError,
    })
    // report && report(payload)
  }, true)
}