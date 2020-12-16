// 忽略此类错误
const ignoreError = [
  'ResizeObserver loop limit exceeded',
]

export default function recordJsError() {
  const { report, frequency: { jsError } } = this;

  window.addEventListener('error', function (ev) {
    const { target } = ev;
    const willdo = Math.random() < jsError;
    // 资源加载错误
    if (target && (target.href || target.src)) {
      // console.log("资源加载 错误", target, ev)
      const { nodeName } = target;
      const payload = {
        type: 'resourceError', // resource error、
        nodeName, // 标签名
        source: target.href || target.src, // 资源地址
      }
      willdo && report && report(payload) // 实例挂载的 上报方法
      return
    }

    // console.log("js 脚本错误", ev, target)
    // js 脚本错误
    const { lineno, colno, message } = ev;
    
    if (ignoreError.includes(message)) { // 忽略此类错误
      console.log('忽略错误 --> ', message)
      return 
    }

    const payload = {
      type: 'jsError',
      message,
      // ln: lineno,
      // col: colno,
      position: `${lineno}:${colno}`,
      stack: ev?.error?.stack,
    }

    willdo && report && report(payload) // 实例挂载的 上报方法
  }, true)
}