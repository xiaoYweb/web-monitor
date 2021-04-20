import recordJsError from './monitor/lib/jsError';
import recordPromiseError from './monitor/lib/promiseError';
import enhanceAjax from './monitor/lib/ajax';
import enhanceFetch from './monitor/lib/fetch';
import timing from './monitor/lib/timing';
import axios from 'axios';
import { getExtraInfo, selfStringify } from './monitor/utils';


export default class WebMonitor {
  constructor(props) {
    const { allowApiList, report, appName, reportUrl, frequency = {} } = props;
    if (!appName) {
      throw new Error('appName 为必填项')
    }
    if (!report && !reportUrl) {
      throw new Error('reportUrl 为必填项')
    }
    if (allowApiList.some(item => item.includes('webmonitor'))) {
      throw new Error('/webmonitor 不能作为 允许上报的api')
    }
    this.frequency = Object.assign({
      jsError: 0.3,
      resourceError: 0.3,
      apiError: 0.3,
      unhandledrejection: 0.3,
      timing: 1
    }, frequency)
    this.reportUrl = reportUrl;
    this.allowApiList = allowApiList || []; // 允许上报的 /api   包含关系

    const reportInfo = report || this.insideReport; // 
    this.report = (params) => {
      const payload = Object.assign(params, getExtraInfo(), { appName })
      // console.log('payload', payload)
      reportInfo.call(this, payload)
    };
  }

  insideReport(payload) {
    const reportUrl = this.reportUrl;
    // this.xhrReport(reportUrl, payload);
    // this.imgReport(payload, reportUrl);
    // this.beaconReport(payload, reportUrl);
    typeof navigator.sendBeacon === 'function'
      ? this.beaconReport(reportUrl, payload)
      : this.xhrReport(payload, reportUrl)
  }

  xhrReport(reportUrl, payload) {
    axios.post(reportUrl, payload).catch(err => {
      console.log('sdk insideReport err', err)
    })
  }

  // 复杂传参编码问题 ..
  imgReport(reportUrl, payload) {
    const data = selfStringify(payload)
    const img = new Image()
    img.src = `${reportUrl}?data=${data}`;
  }

  beaconReport(reportUrl, payload) {
    const blob = new Blob([selfStringify(payload)], {
      // type: 'application/x-www-form-urlencoded',
      type: 'application/json; charset=UTF-8'
    });
    navigator.sendBeacon(reportUrl, blob);
  }

  init() {
    this.recordJsError()
    this.recordPromiseError()
    this.enhanceAjax()
    this.enhanceFetch()
    this.timing()
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
  timing(...r) {
    timing.apply(this, r)
  }
  // enhanceAjax
  // recordJsErrorå
  // recordPromiseError
  // timing
}
console.log('版本修改时间为 2021-02-02 重写fetch 新增 beaconReport 上报')
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
