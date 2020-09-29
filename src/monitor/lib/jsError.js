import { getExtraInfo } from '../utils/getExtraInfo';

window.addEventListener('error', function (ev) {
  
  const { target } = ev;
  
  // 资源加载错误
  if (target && (target.href || target.src)) { 
    console.log("资源加载 错误", target, ev)
    const { nodeName } = target;
    report({
      ...getExtraInfo(),
      errorType: '资源加载错误',
      errorTypeNo: '2',
      tagName: nodeName,
      source: target.href || target.src,
    })
    return 
  } 

  console.log("js 脚本错误", ev, target)
  // js 脚本错误
  const { lineno, colno, message } = ev;
  report({
    ...getExtraInfo(),
    errorType: 'jsError',
    errorTypeNo: '1',
    message,
    ln: lineno,
    col: colno,
  })
}, true)

function report(data) {
  console.log('report', data)
}