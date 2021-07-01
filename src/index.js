import recordPv from './monitor/lib/pv';
import recordUv from './monitor/lib/uv';
import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import enhanceFetch from './monitor/lib/fetch';
import performance from './monitor/lib/performance';
import behavior from './monitor/lib/behavior';
import querystring from 'querystring';
import axios from 'axios';
import { getExtraInfo, selfStringify, retRandomString } from './monitor/utils';


let once = false; // init 只允许执行一次
export default class WebMonitor {
  constructor(props) {
    const {
      allowApiList, report, appName,
      reportUrl = 'https://monitor-test.xinc818.com/webmonitor/report',
      frequency = {},
    } = props;
    if (!appName) {
      throw new Error('appName 为必填项')
    }
    if (allowApiList.some(item => item.includes('webmonitor'))) {
      throw new Error('/webmonitor 不能作为 允许上报的api')
    }
    this.frequency = Object.assign({
      jsError: 1,
      resourceError: 1,
      apiError: 1,
      unhandledrejection: 0,
      performance: 1
    }, frequency)
    this.reportUrl = reportUrl;
    this.allowApiList = allowApiList || []; // 允许上报的 /api   包含关系

    const reportInfo = report || this.insideReport; // 
    this.report = (params) => {
      const { maskUser } = this; // 闭包获取对象 对象引用值
      const payload = Object.assign({ appName, maskUser }, getExtraInfo(), params)
      reportInfo.call(this, payload)
    };

    this.init()
  }

  insideReport(payload) {
    const reportUrl = this.reportUrl;
    const url = `${reportUrl}?${querystring.stringify(payload)}`;
    // IE 2083  firefox  65536  chrome 8182 Safari 80000 Opera 190000
    if (url.length < 8000) {
      return this.imgReport(url);
    }
    if (typeof navigator.sendBeacon === 'function') {
      return this.beaconReport(reportUrl, payload)
    }
    this.xhrReport(reportUrl, payload);
  }

  xhrReport(reportUrl, payload) {
    axios.post(reportUrl, payload).catch(err => {
      console.log('sdk insideReport err', err)
    })
  }

  // img 标签上报 ...
  imgReport(url) {
    const img = new Image()
    img.src = url;
    img.crossorigin = 'anonymous';
  }

  beaconReport(reportUrl, payload) {
    const blob = new Blob([selfStringify(payload)], {
      // type: 'application/x-www-form-urlencoded',
      type: 'application/json; charset=UTF-8'
    });
    navigator.sendBeacon(reportUrl, blob);
  }

  init() {
    if (once) return;// init 只允许执行一次
    this.recordUv() // 生成 maskUser 所以 需要先执行
    this.recordPv()
    this.recordJsError()
    this.recordPromiseError()
    this.enhanceAjax()
    this.enhanceFetch()
    this.performance()
    this.behavior()
    once = true;
  }

  recordPv(...r) {
    recordPv.apply(this, r)
  }
  recordUv(...r) {
    recordUv.apply(this, r)
  }
  enhanceAjax(...r) {
    enhanceAjax.apply(this, r)
  }
  enhanceFetch(...r) {
    enhanceFetch.apply(this, r)
  }
  recordJsError(...r) {
    recordJsError.apply(this, r)
  }
  recordPromiseError(...r) {
    recordPromiseError.apply(this, r)
  }
  performance(...r) {
    performance.apply(this, r)
  }
  behavior(...r) {
    behavior.apply(this, r)
  }
}
console.log('版本修改时间为 2021-06-29')
// ------------- 下方代码 build 后 需要注释 ------------------------------------------
// window._userInfo = {
//   userName: 'testName',
//   userId: 'testId',
// };
// new WebMonitor({
//   appName: 'Test',
//   reportUrl: 'http://127.0.0.1:7003/webmonitor/report',
//   report: (payload) => { // 上报内容
//     console.log('report --> payload', payload)
//     axios.post('http://127.0.0.1:7003/webmonitor/report', payload).catch(err => {

//     })
//     const data = selfStringify(payload)
//     axios.get('http://127.0.0.1:7003/webmonitor/report', { params: { data } }).catch(err => {

//     })
//   },
//   allowApiList: ['/self'], // 允许上报的 /api 包含关系 
// }).init()
