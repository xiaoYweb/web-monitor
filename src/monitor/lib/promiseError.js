import webtrack from '../utils/webtrack';

window.addEventListener("unhandledrejection", function (ev) {
  // ev.preventDefault() // 
  console.log('promise 错误', ev);
  const { target, lineno, colno, message } = ev;
  const payload = {
    errorType: 'unhandled rejection',
    errorTypeNo: '3',
    message,
    // ln: lineno,
    // col: colno,
    position: lineno + ' : ' + colno
  }
  
  webtrack.report(payload)
  return true;
}, true);
