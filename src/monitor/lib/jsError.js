import { handleBantchReport } from '../utils';

const sourceCache = []
const cache = [];

export default function recordJsError() {
  const { report, onceReport } = this;
  
  window.addEventListener('error', function (ev) {
   const { target } = ev;

    // 资源加载错误
    if (target && (target.href || target.src)) {
      // console.log("资源加载 错误", target, ev)
      const { nodeName } = target;
      const payload = {
        type: 'resourceError', // resource error、
        nodeName, // 标签名
        source: target.href || target.src, // 资源地址
      }
      // report && report(payload)
      handleBantchReport({
        report, cache: sourceCache, payload,
        maxLength: onceReport?.resourceError,
      })
      return
    }

    // console.log("js 脚本错误", ev, target)
    // js 脚本错误
    const { lineno, colno, message } = ev;

    const payload = {
      type: 'jsError',
      message,
      // ln: lineno,
      // col: colno,
      position: `${lineno}:${colno}`,
      stack: ev?.error?.stack,
    }
    handleBantchReport({
      report, cache, payload,
      maxLength: onceReport?.jsError,
    })
    // report && report(payload)
  }, true)
}