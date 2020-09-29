import { getExtraInfo } from '../utils/getExtraInfo';

window.addEventListener("unhandledrejection", function (ev) {
  // ev.preventDefault() // 
  console.log('promise 错误', ev);
  const { target, lineno, colno, message } = ev;
  const payload = {
    ...getExtraInfo(),
    errorType: 'unhandledrejection',
    errorTypeNo: '3',
    message,
    ln: lineno,
    col: colno,
  }
  
  report(payload)
  return true;
}, true);

function report(data) {
  console.log('report', data)
}
