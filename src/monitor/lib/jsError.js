import webtrack from '../utils/webtrack';

export default function recordJsError() {
  window.addEventListener('error', function (ev) {
    const { target } = ev;

    // 资源加载错误
    if (target && (target.href || target.src)) {
      console.log("资源加载 错误", target, ev)
      const { nodeName } = target;
      webtrack.report({
        errorType: '资源加载错误', // resource error
        errorTypeNo: '2',
        nodeName,
        source: target.href || target.src,
      })
      return
    }

    console.log("js 脚本错误", ev, target)
    // js 脚本错误
    const { lineno, colno, message, error: { stack }  } = ev;

    webtrack.report({
      errorType: 'jsError',
      errorTypeNo: '1',
      message,
      ln: lineno,
      col: colno,
      position: `${lineno}:${colno}`,
      stack,
    })

  }, true)
}